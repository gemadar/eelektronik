package models

import (
	"time"
)

type ActiveUser struct {
	Id        int       `json:"id"`
	Name      string    `json:"name,ommitempty"`
	Username  string    `json:"username,ommitempty"`
	Password  string    `json:"password"`
	Role      string    `json:"role,ommitempty"`
	Sub       string    `json:"sub,ommitempty"`
	IssuedAt  time.Time `json:"issued_at,ommitempty"`
	IsLogin   string    `json:"is_login,ommitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
