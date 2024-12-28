from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False)

    datos_viajero = db.relationship('DatosViajero', backref=db.backref('user', uselist=False))
    empresas = db.relationship('Empresa', backref=db.backref('user', lazy=True))
    qr_databases = db.relationship('QRDatabase', backref=db.backref('user', lazy=True))
    reservas = db.relationship('Reservas', backref=db.backref('user', lazy=True))
    transacciones = db.relationship('Transaccion', backref=db.backref('user', lazy=True))

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "empresas": [empresa.serialize() for empresa in self.empresas],
            "transacciones": [transaccion.serialize() for transaccion in self.transacciones],
            "datos_viajero": self.datos_viajero.serialize() if self.datos_viajero else None,
            "reservas": [reserva.serialize() for reserva in self.reservas],
        }

class DatosViajero(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    primer_apellido = db.Column(db.String(100), nullable=False)
    segundo_apellido = db.Column(db.String(100), nullable=False)
    sexo = db.Column(db.String(10), nullable=False)
    nif = db.Column(db.String(20), nullable=False, index=True)
    numero_soporte_documento = db.Column(db.String(20), nullable=False)
    tipo_documento = db.Column(db.String(20), nullable=False)
    nacionalidad = db.Column(db.String(100), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    direccion = db.Column(db.String(200), nullable=False)
    localidad = db.Column(db.String(100), nullable=False)
    pais = db.Column(db.String(100), nullable=False)
    telefono_fijo = db.Column(db.String(20), nullable=False)
    telefono_movil = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    numero_viajeros = db.Column(db.Integer, nullable=False)
    parentesco_viajeros = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "primer_apellido": self.primer_apellido,
            "segundo_apellido": self.segundo_apellido,
            "sexo": self.sexo,
            "nif": self.nif,
            "numero_soporte_documento": self.numero_soporte_documento,
            "tipo_documento": self.tipo_documento,
            "nacionalidad": self.nacionalidad,
            "fecha_nacimiento": self.fecha_nacimiento,
            "direccion": self.direccion,
            "localidad": self.localidad,
            "pais": self.pais,
            "telefono_fijo": self.telefono_fijo,
            "telefono_movil": self.telefono_movil,
            "email": self.email,
            "numero_viajeros": self.numero_viajeros,
            "parentesco_viajeros": self.parentesco_viajeros
        }

class Empresa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    razon_social = db.Column(db.String(200), nullable=False)
    cif = db.Column(db.String(20), nullable=False, index=True)
    nombre_comercial = db.Column(db.String(200), nullable=False)
    domicilio = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    datos_empresa = db.relationship('DatosEmpresa', backref=db.backref('empresa', uselist=False))

    def serialize(self):
        return {
            "id": self.id,
            "razon_social": self.razon_social,
            "cif": self.cif,
            "nombre_comercial": self.nombre_comercial,
            "domicilio": self.domicilio,
            "user_id": self.user_id,
            "datos_empresa": self.datos_empresa.serialize() if self.datos_empresa else None
        }

class DatosEmpresa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=False)
    razon_social = db.Column(db.String(200), nullable=False)
    cif = db.Column(db.String(20), nullable=False)
    municipio = db.Column(db.String(100), nullable=False)
    provincia = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    web = db.Column(db.String(200), nullable=False)
    url_anuncio = db.Column(db.String(200), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "razon_social": self.razon_social,
            "cif": self.cif,
            "municipio": self.municipio,
            "provincia": self.provincia,
            "telefono": self.telefono,
            "email": self.email,
            "web": self.web,
            "url_anuncio": self.url_anuncio
        }

class Establecimiento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(100), nullable=False)
    direccion = db.Column(db.String(200), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)

    datos_establecimiento = db.relationship('DatosEstablecimiento', backref='establecimiento', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "tipo": self.tipo,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "email": self.email,
            "datos_establecimiento": self.datos_establecimiento.serialize() if self.datos_establecimiento else None
        }

class DatosEstablecimiento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    establecimiento_id = db.Column(db.Integer, db.ForeignKey('establecimiento.id'), nullable=False)
    tipo_establecimiento = db.Column(db.String(20), nullable=False)
    denominacion = db.Column(db.String(200), nullable=False)
    direccion = db.Column(db.String(200), nullable=False)
    cod_postal = db.Column(db.String(200), nullable=False)
    localidad_y_provincia = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "tipo_establecimiento": self.tipo_establecimiento,
            "denominacion": self.denominacion,
            "direccion": self.direccion,
            "cod_postal": self.cod_postal,
            "localidad_y_provincia": self.localidad_y_provincia
        }

class QRDatabase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    archivo = db.Column(db.String(200), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "archivo": self.archivo
        }

class Reservas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    numero_res = db.Column(db.Integer, nullable=False, index=True)
    fecha_res = db.Column(db.Date, nullable=False)
    fecha_ini = db.Column(db.Date, nullable=False)
    fecha_fin = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    alojamiento_id = db.Column(db.Integer, db.ForeignKey('alojamientos.id'), nullable=False)
    medio_pago_id = db.Column(db.Integer, db.ForeignKey('medios_pago.id'), nullable=False)
    transaccion_id = db.Column(db.Integer, db.ForeignKey('transaccion.id'), nullable=False)  

    alojamiento = db.relationship('Alojamientos', backref=db.backref('reservas', lazy=True))
    medio_pago = db.relationship('MediosPago', backref=db.backref('reservas', lazy=True))
    transaccion = db.relationship('Transaccion', backref=db.backref('reservas', lazy=True))  

    def serialize(self):
        return {
            "id": self.id,
            "numero_res": self.numero_res,
            "fecha_res": self.fecha_res,
            "fecha_ini": self.fecha_ini,
            "fecha_fin": self.fecha_fin,
            "user": self.user.serialize() if self.user else None,
            "alojamiento": self.alojamiento.serialize() if self.alojamiento else None,
            "medio_pago": self.medio_pago.serialize() if self.medio_pago else None,
            "transaccion": self.transaccion.serialize() if self.transaccion else None
        }

class Transaccion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    referencia = db.Column(db.String(100), nullable=False, index=True)
    fecha_transaccion = db.Column(db.Date, nullable=True)
    firmas = db.Column(db.String(100), nullable=False)
    fecha_hora_entrada = db.Column(db.DateTime, nullable=False)
    fecha_hora_salida = db.Column(db.DateTime, nullable=False)
    direccion = db.Column(db.String(200), nullable=False)
    numero_habitaciones = db.Column(db.Integer, nullable=False)
    conexion_internet = db.Column(db.Boolean(), nullable=False)
    tipo = db.Column(db.String(100), nullable=False)
    identificacion_medio_pago = db.Column(db.String(100), nullable=False)
    titular_medio_pago = db.Column(db.String(100), nullable=False)
    fecha_caducidad_tarjeta = db.Column(db.Date, nullable=False)
    fecha_pago = db.Column(db.Date, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "referencia": self.referencia,
            "fecha_transaccion": self.fecha_transaccion,
            "firmas": self.firmas,
            "fecha_hora_entrada": self.fecha_hora_entrada,
            "fecha_hora_salida": self.fecha_hora_salida,
            "direccion": self.direccion,
            "numero_habitaciones": self.numero_habitaciones,
            "conexion_internet": self.conexion_internet,
            "tipo": self.tipo,
            "identificacion_medio_pago": self.identificacion_medio_pago,
            "titular_medio_pago": self.titular_medio_pago,
            "fecha_caducidad_tarjeta": self.fecha_caducidad_tarjeta,
            "fecha_pago": self.fecha_pago
        }
        
# class GuardiaCivil(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     qr_id = db.Column(db.Integer, db.ForeignKey('qr_database.id'), nullable=False)
#     reserva_id = db.Column(db.Integer, db.ForeignKey('reservas.id'), nullable=False)
#     empresa_id = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=False)

#     user = db.relationship('User', backref=db.backref('guardia_civil', lazy=True))
#     qr = db.relationship('QRDatabase', backref=db.backref('guardia_civil', lazy=True))
#     reserva = db.relationship('Reservas', backref=db.backref('guardia_civil', lazy=True))
#     empresa = db.relationship('Empresa', backref=db.backref('guardia_civil', lazy=True))

#     def serialize(self):
#         return {
#             "id": self.id,
#             "user": self.user.serialize() if self.user else None,
#             "qr": self.qr.serialize() if self.qr else None,
#             "reserva": self.reserva.serialize() if self.reserva else None,
#             "empresa": self.empresa.serialize() if self.empresa else None
#         }