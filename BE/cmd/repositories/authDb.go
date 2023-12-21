package repositories

import (
	"eelektronik-echo/cmd/models"
	"errors"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func tokenKey() string {
	err := godotenv.Load(filepath.Join("./", ".env"))
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("JWT_SECRET")
}

func ClearIsLogin() {
	db.Model(&models.ActiveUser{}).Where("(issued_at + interval '3 Hours') < ?", time.Now()).Updates(map[string]interface{}{"sub": nil, "issued_at": nil, "is_login": nil})
	db.Model(&models.ActiveUser{}).Where("(updated_at + interval '30 Minutes') < ?", time.Now()).Updates(map[string]interface{}{"sub": nil, "issued_at": nil, "is_login": nil})
}

func Schedule(what func(), delay time.Duration) chan bool {
	stop := make(chan bool)

	go func() {
		for {
			what()
			select {
			case <-time.After(delay):
			case <-stop:
				return
			}
		}
	}()
	return stop
}

func LogIn(user models.ActiveUser) ([]string, error) {
	var data models.ActiveUser

	result := db.Where("username = ?", user.Username).Select("name", "password", "role", "username", "is_login", "issued_at", "updated_at").Find(&data)

	if result.Error != nil {
		if result.RowsAffected == 0 {
			return nil, nil
		}
		return nil, nil
	}

	if err := bcrypt.CompareHashAndPassword([]byte(data.Password), []byte(user.Password)); err != nil {
		return nil, errors.New("Wrong credentials")
	}

	if data.IsLogin == "1" {
		if data.IssuedAt.Add(3*time.Hour).Compare(time.Now()) == -1 {
			db.Model(&models.ActiveUser{}).Where("username = ?", user.Username).Updates(map[string]interface{}{"sub": nil, "issued_at": nil, "is_login": nil})
		} else if data.UpdatedAt.Add(30*time.Minute).Compare((time.Now())) == -1 {
			db.Model(&models.ActiveUser{}).Where("username = ?", user.Username).Updates(map[string]interface{}{"sub": nil, "issued_at": nil, "is_login": nil})
		} else {
			return nil, errors.New("User is currently logged in")
		}
	}

	token, refresh := tokenGen(data, "login")

	return []string{token, refresh}, nil
}

func tokenGen(data models.ActiveUser, method string) (string, string) {
	claims := &models.Claims{
		Name:     data.Name,
		Role:     data.Role,
		Username: data.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(5 * time.Minute)),
		},
	}

	refClaims := &models.TokenRef{
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt: jwt.NewNumericDate(time.Now()),
			Subject:  WordsGen(9),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	reftoken := jwt.NewWithClaims(jwt.SigningMethodHS256, refClaims)
	sub, _ := reftoken.Claims.GetSubject()
	db.Model(&models.ActiveUser{}).Where("username = ?", data.Username).Update("sub", sub)

	if method == "login" {
		iss, _ := reftoken.Claims.GetIssuedAt()
		db.Model(&models.ActiveUser{}).Where("username = ?", data.Username).Updates(models.ActiveUser{IssuedAt: iss.Time, IsLogin: "1"})
	}

	jwtKey := []byte(tokenKey()) //parameterized
	tokenString, _ := token.SignedString(jwtKey)
	refTokenString, _ := reftoken.SignedString(jwtKey)

	return tokenString, refTokenString
}

func Refresh(Req string) ([]string, error) {
	claims, _ := jwt.ParseWithClaims(Req, &models.TokenRef{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(tokenKey()), nil
	})

	if claims.Valid {
		var data models.ActiveUser
		sub, _ := claims.Claims.GetSubject()
		result := db.Where("sub = ?", sub).Select("role", "name", "username", "issued_at").Find(&data)
		if result.RowsAffected > 0 {
			if data.IssuedAt.Add(3*time.Hour).Compare(time.Now()) == 1 {
				t, rt := tokenGen(data, "refresh")
				return []string{t, rt}, nil
			}
			return nil, errors.New("Unauthorized")
		} else {
			return nil, errors.New("Unauthorized")
		}
	} else {
		return nil, errors.New("Unauthorized")
	}
}

func LogOut(user models.ActiveUser) string {
	result := db.Model(&models.ActiveUser{}).Where("username = ?", user.Username).Updates(map[string]interface{}{"sub": nil, "issued_at": nil, "is_login": nil})

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}
