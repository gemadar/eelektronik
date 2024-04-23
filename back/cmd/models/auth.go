package models

import "github.com/golang-jwt/jwt/v5"

type Claims struct {
	Name     string `json:"name"`
	Role     string `json:"role"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type TokenRef struct {
	jwt.RegisteredClaims
}

type Req struct {
	Rt string `json:"rt" binding:"required"`
}
