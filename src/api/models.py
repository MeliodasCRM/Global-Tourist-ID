from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
from sqlalchemy.dialects.postgresql import JSON


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    language = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # Relaciones
    contacts = db.relationship('Contact', backref='user', lazy=True)
    groups = db.relationship('Group', backref='user', lazy=True)
    empresas = db.relationship('Empresa', backref='user', lazy=True)
    permissions = db.relationship('UserPermission', backref='user', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'language': self.language,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

# Add association table for Contact-Group relationship
contact_group = db.Table('contact_group',
    db.Column('contact_id', db.Integer, db.ForeignKey('contact.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('group.id'), primary_key=True)
)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    primer_apellido = db.Column(db.String(255), nullable=False)
    segundo_apellido = db.Column(db.String(255), nullable=False)
    sexo = db.Column(db.String(50), nullable=False)
    nacionalidad = db.Column(db.String(100), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    direccion = db.Column(db.String(255), nullable=False)
    localidad = db.Column(db.String(255), nullable=False)
    pais = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telefono_movil = db.Column(db.String(20), nullable=False)
    telefono_fijo = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # Relaciones
    sensitive_data = db.relationship('SensitiveData', backref='contact', uselist=False, lazy=True)
    grupos = db.relationship('Group', 
                           secondary=contact_group,
                           back_populates='contacts')
    reservas = db.relationship('Reserva', backref='traveler', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'nombres': self.nombre,
            'primer_apellido': self.primer_apellido,
            'segundo_apellido': self.segundo_apellido,
            'nacionalidad': self.nacionalidad,
            'fecha_nacimiento': self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None,
            'direccion': self.direccion,
            'localidad': self.localidad,
            'pais': self.pais,
            'email': self.email,
            'telefono_movil': self.telefono_movil,
            'telefono_fijo': self.telefono_fijo,
            'user_id': self.user_id
        }

class TipoNif(Enum):
    DNI = 'DNI'
    TIE = 'TIE'
    PASAPORTE = 'Pasaporte'

class SensitiveData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nif_tipo = db.Column(db.Enum(TipoNif), nullable=False)
    nif_numero = db.Column(db.String(50), nullable=False)
    nif_country = db.Column(db.String(100), nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'))

    def serialize(self):
        return {
            'id': self.id,
            'nif_tipo': self.nif_tipo,
            'nif_numero': self.nif_numero,
            'nif_country': self.nif_country,
            'contact_id': self.contact_id
        }

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    group_name = db.Column(db.String(255))
    is_admin = db.Column(db.Boolean, default=False)
    contacts = db.relationship('Contact',
                             secondary=contact_group,
                             back_populates='grupos')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'group_name': self.group_name,
            'is_admin': self.is_admin
        }

class MedioPagoTipo(Enum):
    EFECTIVO = 'Efectivo'
    TARJETA = 'Tarjeta'
    PLATAFORMA_DE_PAGO = 'Plataforma de Pago'
    TRANSFERENCIA = 'Transferencia'

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fecha_entrada = db.Column(db.Date)
    fecha_salida = db.Column(db.Date)
    alojamiento = db.Column(db.Integer, db.ForeignKey('empresa.id'))
    nro_rooms = db.Column(db.Integer)
    nro_viajeros = db.Column(db.Integer)
    titular_medio_pago = db.Column(db.String(255))
    medio_pago_tipo = db.Column(db.Enum(MedioPagoTipo, name="mediopagotipo"), nullable=False)
    medio_pago_nro = db.Column(db.Integer)
    medio_pago_expira = db.Column(db.Date)
    fecha_pago = db.Column(db.Date)
    traveler_id = db.Column(db.Integer, db.ForeignKey('contact.id'))
    created = db.Column(db.Date, default=datetime.utcnow)
    
    empresa = db.relationship('Empresa', backref='reservas', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'fecha_entrada': self.fecha_entrada.isoformat() if self.fecha_entrada else None,
            'fecha_salida': self.fecha_salida.isoformat() if self.fecha_salida else None,
            'alojamiento': self.alojamiento,
            'nro_rooms': self.nro_rooms,
            'titular_medio_pago': self.titular_medio_pago,
            'medio_pago_tipo': self.medio_pago_tipo.value if self.medio_pago_tipo else None,
            'medio_pago_nro': self.medio_pago_nro,
            'medio_pago_expira': self.medio_pago_expira.isoformat() if self.medio_pago_expira else None,
            'fecha_pago': self.fecha_pago.isoformat() if self.fecha_pago else None,
            'nro_viajeros': self.nro_viajeros,
            'traveler_id': self.traveler_id,
            'created': self.created.isoformat() if self.created else None
        }

class Empresa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    razon_social = db.Column(db.String(255))
    cif = db.Column(db.String(50))
    tipo = db.Column(db.String(50))
    domicilio = db.Column(db.String(255))
    municipio = db.Column(db.String(255))
    provincia = db.Column(db.String(255))
    cod_postal = db.Column(db.Integer)
    email = db.Column(db.String(120))
    web = db.Column(db.String(255))
    url_anuncio = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    reserva_id = db.Column(db.Integer)

    def serialize(self):
        return {
            'id': self.id,
            'razon_social': self.razon_social,
            'cif': self.cif,
            'tipo': self.tipo,
            'domicilio': self.domicilio,
            'municipio': self.municipio,
            'provincia': self.provincia,
            'cod_postal': self.cod_postal,
            'email': self.email,
            'web': self.web,
            'url_anuncio': self.url_anuncio,
            'user_id': self.user_id,
            'reserva_id': self.reserva_id
        }

class UserPermission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    permissions = db.Column(JSON)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'permissions': self.permissions
        }
    