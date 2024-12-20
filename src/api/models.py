from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "empresas": [empresa.serialize() for empresa in self.empresas],
            "transacciones": [transaccion.serialize() for transaccion in self.transacciones],
        }

class Empresa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    razon_social = db.Column(db.String(200), nullable=False)
    cif = db.Column(db.String(20), nullable=False)
    nombre_comercial = db.Column(db.String(200), nullable=False)
    domicilio = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('empresas', lazy=True))

    def serialize(self):
        return {
            "id": self.id,
            "razon_social": self.razon_social,
            "cif": self.cif,
            "nombre_comercial": self.nombre_comercial,
            "domicilio": self.domicilio,
            "user_id": self.user_id
        }

class Alojamientos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ref = db.Column(db.Integer, nullable=False)
    estado_finca = db.Column(db.String(100), nullable=False)
    clase_finca = db.Column(db.String(100), nullable=False)
    finca_nombre = db.Column(db.String(200), nullable=False)
    domicilio = db.Column(db.String(200), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "ref": self.ref,
            "estado_finca": self.estado_finca,
            "clase_finca": self.clase_finca,
            "finca_nombre": self.finca_nombre,
            "domicilio": self.domicilio
        }

class MediosPago(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre_medio_pago = db.Column(db.String(100), nullable=False)
    numero = db.Column(db.Integer, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    codigo_secreto = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre_medio_pago": self.nombre_medio_pago,
            "numero": self.numero,
            "fecha": self.fecha
            # código_secreto excluido por seguridad
        }

class Preguntas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pregunta1 = db.Column(db.String(500), nullable=False)
    pregunta2 = db.Column(db.String(500), nullable=False)
    pregunta10 = db.Column(db.String(500), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "pregunta1": self.pregunta1,
            "pregunta2": self.pregunta2,
            "pregunta10": self.pregunta10
        }

class Transacciones(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tipo_transaccion = db.Column(db.String(100), nullable=False)

    user = db.relationship('User', backref=db.backref('transacciones', lazy=True))

    def serialize(self):
        return {
            "id": self.id,
            "fecha": self.fecha,
            "user_id": self.user_id,
            "tipo_transaccion": self.tipo_transaccion
        }

class TipoTransacciones(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    transaccion_id = db.Column(db.Integer, db.ForeignKey('transacciones.id'), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)

    transaccion = db.relationship('Transacciones', backref=db.backref('tipos_transaccion', lazy=True))

    def serialize(self):
        return {
            "id": self.id,
            "transaccion_id": self.transaccion_id,
            "nombre": self.nombre
        }

class QRDatabase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    archivo = db.Column(db.String(200), nullable=False)

    user = db.relationship('User', backref=db.backref('qr_databases', lazy=True))

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "archivo": self.archivo
        }

class Reservas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    numero_res = db.Column(db.Integer, nullable=False)
    fecha_res = db.Column(db.Date, nullable=False)
    fecha_ini = db.Column(db.Date, nullable=False)
    fecha_fin = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    alojamiento_id = db.Column(db.Integer, db.ForeignKey('alojamientos.id'), nullable=False)
    medio_pago_id = db.Column(db.Integer, db.ForeignKey('medios_pago.id'), nullable=False)
    transaccion_id = db.Column(db.Integer, db.ForeignKey('transacciones.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('reservas', lazy=True))
    alojamiento = db.relationship('Alojamientos', backref=db.backref('reservas', lazy=True))
    medio_pago = db.relationship('MediosPago', backref=db.backref('reservas', lazy=True))
    transaccion = db.relationship('Transacciones', backref=db.backref('reservas', lazy=True))

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

class GuardiaCivil(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    qr_id = db.Column(db.Integer, db.ForeignKey('qr_database.id'), nullable=False)
    reserva_id = db.Column(db.Integer, db.ForeignKey('reservas.id'), nullable=False)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('guardia_civil', lazy=True))
    qr = db.relationship('QRDatabase', backref=db.backref('guardia_civil', lazy=True))
    reserva = db.relationship('Reservas', backref=db.backref('guardia_civil', lazy=True))
    empresa = db.relationship('Empresa', backref=db.backref('guardia_civil', lazy=True))

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.serialize() if self.user else None,
            "qr": self.qr.serialize() if self.qr else None,
            "reserva": self.reserva.serialize() if self.reserva else None,
            "empresa": self.empresa.serialize() if self.empresa else None
        }
