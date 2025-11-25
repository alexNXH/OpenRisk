package config

// import "github.com/spf13/viper"
import (
	"os"
	"strconv"
)


type ServerConfig struct {
	Port int
	JWTSecret string
}

// Structure pour la configuration de la base de données (résout "undefined: DatabaseConfig")
type DatabaseConfig struct {
	Host string
	Port int
	User string
	Password string
	DBName string
}

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	// Modules externes
	Integrations IntegrationsConfig
}

type IntegrationsConfig struct {
	TheHive  ExternalService `mapstructure:"thehive"`
	OpenCTI  ExternalService `mapstructure:"opencti"`
	OpenRMF  ExternalService `mapstructure:"openrmf"`
}

type ExternalService struct {
	Enabled bool   `mapstructure:"enabled"`
	URL     string `mapstructure:"url"`
	APIKey  string `mapstructure:"api_key"`
}

// LoadConfig charge les configurations depuis les variables d'environnement
func LoadConfig() *Config {
	// Implémentation simplifiée
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	
	// Dans un environnement de dev, le port DB est souvent le 5432 par défaut
	dbPort := 5432 

	return &Config{
		Server: ServerConfig{
			Port: port,
			JWTSecret: os.Getenv("JWT_SECRET"),
		},
		Database: DatabaseConfig{
			Host: os.Getenv("DB_HOST"),
			Port: dbPort,
			User: os.Getenv("DB_USER"),
			Password: os.Getenv("DB_PASSWORD"),
			DBName: os.Getenv("DB_NAME"),
		},
	}
}