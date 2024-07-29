import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-4iw$k27ul1x&$*j!2u4v!j+nfyo&(%)df_v0uz^zhei+odrm7q'
DEBUG = True
ALLOWED_HOSTS = [
    'localhost',                                        # Allow requests from localhost
    '127.0.0.1',                                        # Allow requests from 127.0.0.1
    'app',                                              # Allow requests from the 'app' service in Docker
    'djangoApi',                                        # Allow requests from the 'djangoApi' service in Docker
    'ec2-3-141-0-239.us-east-2.compute.amazonaws.com'   # Allow requests from the AWS EC2 instance
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
#         'NAME': 'AlbumAppDB',
#         'ENFORCE_SCHEMA': False,
#         'CLIENT': {
#             'host': 'mongodb+srv://Cluster27411:cGtCandsa3BS@cluster27411.hcutpri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster27411',
#             'username': 'Cluster27411',
#             'password': 'cGtCandsa3BS',
#             'authMechanism': 'SCRAM-SHA-1',
#             'ssl': True,
#             'ssl_cert_reqs': 'CERT_NONE'  # For testing purposes, disable SSL certificate verification
            
#             # 'tls': True,
#             # 'tlsAllowInvalidCertificates': True,  # Bypass SSL certificate verification
#         }
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': os.getenv('DB_NAME'),
        'CLIENT': {
            'host': os.getenv('DB_HOST'),
            'username': os.getenv('DB_USERNAME') or None,
            'password': os.getenv('DB_PASSWORD') or None,
            'authSource': os.getenv('DB_AUTH_SOURCE'),
            'authMechanism': 'SCRAM-SHA-1',
            'ssl': os.getenv('DB_SSL', 'False').lower() in ['true', '1', 't'],
            'ssl_cert_reqs': 'CERT_NONE'  # For testing purposes, disable SSL certificate verification
        }
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}



# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000'
]

# Define media folder
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# Define the hosts that are allowed to access the API (in our case, it must be the frontend host, localhost:3000)
# CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
CORS_ALLOW_ALL_ORIGINS = True

# settings.py
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'console': {
#             'level': 'DEBUG',
#             'class': 'logging.StreamHandler',
#         },
#         'file': {
#             'level': 'DEBUG',
#             'class': 'logging.FileHandler',
#             'filename': 'myapp.log',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['console', 'file'],
#             'level': 'DEBUG',
#             'propagate': True,
#         },
#     },
# }