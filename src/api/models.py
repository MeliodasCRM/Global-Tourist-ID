from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50))
    plan_id = db.Column(db.Integer, db.ForeignKey('plan.id'))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    
    contacts = db.relationship('Contact', backref='user', lazy=True)
    groups = db.relationship('Group', backref='user', lazy=True)
    empresas = db.relationship('Empresa', backref='user', lazy=True)
    permissions = db.relationship('UserPermission', backref='user', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'plan_id': self.plan_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'account_id': self.account_id
        }

class Plan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    transaction_limit = db.Column(db.Integer)
    features = db.Column(db.String(255))
    permissions = db.Column(JSON)
    price = db.Column(db.String(50))
    duration = db.Column(db.Integer)
    
    users = db.relationship('User', backref='plan', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'transaction_limit': self.transaction_limit,
            'features': self.features,
            'permissions': self.permissions,
            'price': self.price,
            'duration': self.duration
        }

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombres = db.Column(db.String(255), nullable=False)
    primer_apellido = db.Column(db.String(255), nullable=False)
    segundo_apellido = db.Column(db.String(255))
    nacionalidad = db.Column(db.String(100))
    fecha_nacimiento = db.Column(db.Date)
    direccion = db.Column(db.String(255))
    localidad = db.Column(db.String(255))
    pais = db.Column(db.String(100))
    email = db.Column(db.String(120))
    telefono_movil = db.Column(db.String(20))
    telefono_fijo = db.Column(db.String(20))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    sensible_data = db.relationship('SensibleData', backref='contact', uselist=False, lazy=True)
    groups_as_traveler1 = db.relationship('Group', backref='traveler01', foreign_keys='Group.traveler01_id', lazy=True)
    groups_as_traveler2 = db.relationship('Group', backref='traveler02', foreign_keys='Group.traveler02_id', lazy=True)
    reservas = db.relationship('Reserva', backref='traveler', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'nombres': self.nombres,
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

class SensibleData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nif_tipo = db.Column(db.String(50))
    nif_nunero = db.Column(db.String(50))
    nif_country = db.Column(db.String(100))
    firmas = db.Column(db.String(255))
    medio_pago_tipo = db.Column(db.String(50))
    medio_pago_nro = db.Column(db.Integer)
    medio_pago_expira = db.Column(db.Date)
    fecha_pago = db.Column(db.Date)
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'))

    def serialize(self):
        return {
            'id': self.id,
            'nif_tipo': self.nif_tipo,
            'nif_nunero': self.nif_nunero,
            'nif_country': self.nif_country,
            'firmas': self.firmas,
            'medio_pago_tipo': self.medio_pago_tipo,
            'medio_pago_nro': self.medio_pago_nro,
            'medio_pago_expira': self.medio_pago_expira.isoformat() if self.medio_pago_expira else None,
            'fecha_pago': self.fecha_pago.isoformat() if self.fecha_pago else None,
            'contact_id': self.contact_id
        }

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(255))
    traveler01_id = db.Column(db.Integer, db.ForeignKey('contact.id'))
    traveler01_relac = db.Column(db.String(100))
    traveler02_id = db.Column(db.Integer, db.ForeignKey('contact.id'))
    traveler02_relac = db.Column(db.String(100))

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'traveler01_id': self.traveler01_id,
            'traveler01_relac': self.traveler01_relac,
            'traveler02_id': self.traveler02_id,
            'traveler02_relac': self.traveler02_relac
        }

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fecha_entrada = db.Column(db.Date)
    fecha_salida = db.Column(db.Date)
    alojamiento = db.Column(db.Integer, db.ForeignKey('empresa.id'))
    nro_rooms = db.Column(db.Integer)
    nro_viajeros = db.Column(db.String(50))
    metodo_pago = db.Column(db.String(50))
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
            'nro_viajeros': self.nro_viajeros,
            'metodo_pago': self.metodo_pago,
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

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    account_type = db.Column(db.String(50))
    permissions = db.Column(JSON)
    
    users = db.relationship('User', backref='account', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'account_type': self.account_type,
            'permissions': self.permissions
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