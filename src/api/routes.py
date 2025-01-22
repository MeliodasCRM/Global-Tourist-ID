"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint, send_file
from datetime import datetime
import json
import os
import qrcode
from api.models import MedioPagoTipo, db, User, Contact, SensitiveData, Reserva # Importar los modelos de la base de datos
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash #(Libreria que sirve para guardar una constraseña segura)
import qrcode
from io import BytesIO

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)  # Esto te ayudará a verificar los datos recibidos

        email = data.get('email')
        password = data.get('password')
        language = data.get('language')

        if not email or not password or not language:
            print("Datos incompletos")  # Asegúrate de que 'language' esté presente
            return jsonify({"message": "Todos los campos son requeridos"}), 400

        if User.query.filter_by(email=email).first():
            print("Usuario ya existe")
            return jsonify({"message": "El usuario ya existe"}), 400

        hashed_password = generate_password_hash(password)
        print("Contraseña hasheada correctamente")

        new_user = User(
            email=email,
            password=hashed_password,
            language=language,  # Verifica que 'language' se asigne correctamente
            role=None,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        print("Intentando guardar el usuario en la base de datos...")

        db.session.add(new_user)
        db.session.commit()
        print("Usuario guardado exitosamente")

        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error en el endpoint /signup: {str(e)}")  # Imprime el error completo
        return jsonify({"message": "Error interno en el servidor", "error": str(e)}), 500

@api.route ('/login', methods=['POST'])
def handle_Login():
    # Verificar si los datos están presentes
    data = request.json
    if not data:
        return jsonify({"message": "Debe enviar datos en el cuerpo de la solicitud"}), 400

    # Obtener email y contraseña del cuerpo de la solicitud
    email = data.get('email')
    password = data.get('password')

    # Validar email y contraseña
    if not email or not password:
        return jsonify({"message": "El email y password son requeridos"}), 400

    # Buscar el usuario por email en la base de datos
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

    # Crear un token de acceso utilizando el email del usuario
    token = create_access_token(identity=user.email)
    return(token)

@api.route('/user', methods=['GET'])
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id=None):
    try:
        if user_id:
            # Obtener un usuario específico
            user = User.query.get(user_id)
            if not user:
                return jsonify({"message": "Usuario no encontrado"}), 404
            return jsonify(user.serialize()), 200
        else:
            # Obtener todos los usuarios
            users = User.query.all()
            return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        return jsonify({"message": "Error al obtener los usuarios", "error": str(e)}), 500
    
@api.route('/user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        language = data.get('language')

        if not email or not password or not language:
            return jsonify({"message": "El email,password e idioma son requeridos"}), 400

        # Verificar si el usuario ya existe
        if User.query.filter_by(email=email).first():
            return jsonify({"message": "El usuario ya existe"}), 400

        # Hashear la contraseña
        hashed_password = generate_password_hash(password)

        # Crear nuevo usuario
        new_user = User(name=name, email=email, password=hashed_password, language=language ,is_active=True)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Usuario creado exitosamente", "user": new_user.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al crear el usuario", "error": str(e)}), 500


@api.route('/user/<int:user_id>', methods=['PUT'])
def modify_user(user_id):  # Nombre único para la función
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        data = request.get_json()
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.language = data.get('language', user.language)
        user.is_active = data.get('is_active', user.is_active)

        db.session.commit()
        return jsonify({"message": "Usuario actualizado exitosamente", "user": user.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar el usuario", "error": str(e)}), 500
    

@api.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Buscar el usuario en la base de datos por su ID
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Guardar el email del usuario antes de eliminarlo
        user_email = user.email

        # Eliminar el usuario de la base de datos
        db.session.delete(user)
        db.session.commit()

        # Devolver un mensaje con el email del usuario eliminado
        return jsonify({"message": f"Usuario con email '{user_email}' eliminado exitosamente"}), 200

    except Exception as e:
        # Manejar cualquier error inesperado
        db.session.rollback()
        return jsonify({"message": "Error al eliminar el usuario", "error": str(e)}), 500

@api.route('/backoffice')
@jwt_required()  # Asegura que el usuario esté autenticado
def backoffice():
    return jsonify({"message": "Acceso al Backoffice permitido."})

# FUNCION PARA CREAR UN CONTACTO
@api.route('/contact', methods=['POST'])
@jwt_required()
def create_contact():
    try:
        # Obtener usuario actual del token JWT
        current_user_id = get_jwt_identity()
        
        data = request.get_json()
        
        # Crear nuevo contacto con los campos requeridos
        new_contact = Contact(
            nombre=data['nombre'],
            primer_apellido=data['primer_apellido'],
            segundo_apellido=data['segundo_apellido'],
            sexo=data['sexo'],
            nacionalidad=data['nacionalidad'],
            fecha_nacimiento=datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date(),
            direccion=data['direccion'],
            localidad=data['localidad'],
            pais=data['pais'],
            email=data['email'],
            telefono_movil=data['telefono_movil'],
            telefono_fijo=data['telefono_fijo'],
            user_id=current_user_id
        )
        
        db.session.add(new_contact)
        db.session.commit()
        
        return jsonify({
            "message": "Contacto creado exitosamente",
            "contact": new_contact.serialize()
        }), 201
        
    except KeyError as e:
        return jsonify({
            "message": "Datos incompletos",
            "error": f"Falta el campo {str(e)}"
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error al crear el contacto",
            "error": str(e)
        }), 500

# FUNCION PARA GUARDAR LOS DATOS SENSIBLES
@api.route('/sensitive-data', methods=['POST'])
@jwt_required()
def create_sensitive_data():
    try:
        data = request.get_json()
        
        # Verificar que el contacto existe y pertenece al usuario actual
        contact = Contact.query.filter_by(
            id=data['contact_id'],
            user_id=get_jwt_identity()
        ).first()
        
        if not contact:
            return jsonify({
                "message": "Contacto no encontrado o no autorizado"
            }), 404
        
        # Validar tipo de NIF
        try:
            nif_tipo = TipoNif[data['nif_tipo']]
        except KeyError:
            return jsonify({
                "message": "Tipo de NIF inválido",
                "valid_types": [tipo.name for tipo in TipoNif]
            }), 400
        
        new_sensitive_data = SensitiveData(
            nif_tipo=nif_tipo,
            nif_numero=data['nif_numero'],
            nif_country=data['nif_country'],
            contact_id=data['contact_id']
        )
        
        db.session.add(new_sensitive_data)
        db.session.commit()
        
        return jsonify({
            "message": "Datos sensibles guardados exitosamente",
            "sensitive_data": new_sensitive_data.serialize()
        }), 201
        
    except KeyError as e:
        return jsonify({
            "message": "Datos incompletos",
            "error": f"Falta el campo {str(e)}"
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error al guardar los datos sensibles",
            "error": str(e)
        }), 500


# FUNCION PARA GUARDAR LOS DATOS RESERVA
@api.route('/reserva', methods=['POST'])
@jwt_required()
def create_reserva():
    try:
        data = request.get_json()
        
        # Verificar que el viajero existe y pertenece al usuario actual
        traveler = Contact.query.filter_by(
            id=data['traveler_id'],
            user_id=get_jwt_identity()
        ).first()
        
        if not traveler:
            return jsonify({
                "message": "Viajero no encontrado o no autorizado"
            }), 404
            
        # Validar tipo de medio de pago
        try:
            medio_pago = MedioPagoTipo[data['medio_pago_tipo']]
        except KeyError:
            return jsonify({
                "message": "Tipo de medio de pago inválido",
                "valid_types": [tipo.name for tipo in MedioPagoTipo]
            }), 400
        
        nueva_reserva = Reserva(
            fecha_entrada=datetime.strptime(data['fecha_entrada'], '%Y-%m-%d').date(),
            fecha_salida=datetime.strptime(data['fecha_salida'], '%Y-%m-%d').date(),
            alojamiento=data['alojamiento'],
            nro_rooms=data['nro_rooms'],
            nro_viajeros=data['nro_viajeros'],
            titular_medio_pago=data['titular_medio_pago'],
            medio_pago_tipo=medio_pago,
            medio_pago_nro=data.get('medio_pago_nro'),
            medio_pago_expira=datetime.strptime(data['medio_pago_expira'], '%Y-%m-%d').date() if data.get('medio_pago_expira') else None,
            fecha_pago=datetime.strptime(data['fecha_pago'], '%Y-%m-%d').date() if data.get('fecha_pago') else None,
            traveler_id=data['traveler_id']
        )
        
        db.session.add(nueva_reserva)
        db.session.commit()
        
        return jsonify({
            "message": "Reserva creada exitosamente",
            "reserva": nueva_reserva.serialize()
        }), 201
        
    except KeyError as e:
        return jsonify({
            "message": "Datos incompletos",
            "error": f"Falta el campo {str(e)}"
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error al crear la reserva",
            "error": str(e)
        }), 500
    
@api.route('/contact/<int:contact_id>/qr', methods=['GET'])
@jwt_required()
def generate_contact_qr(contact_id):
    try:
        # Verificar que el contacto existe y pertenece al usuario actual
        contact = Contact.query.filter_by(
            id=contact_id,
            user_id=get_jwt_identity()
        ).first()
        
        if not contact:
            return jsonify({
                "message": "Contacto no encontrado o no autorizado"
            }), 404
            
        # Obtener datos sensibles
        sensitive_data = SensitiveData.query.filter_by(contact_id=contact_id).first()
        
        # Crear diccionario con todos los datos
        contact_data = contact.serialize()
        if sensitive_data:
            contact_data['sensitive_data'] = sensitive_data.serialize()
        
        # Convertir datos a JSON
        qr_data = json.dumps(contact_data)
        
        # Generar QR
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)

        # Crear imagen
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Guardar imagen en buffer
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return send_file(
            img_buffer,
            mimetype='image/png',
            as_attachment=True,
            download_name=f'contact_{contact_id}_qr.png'
        )
        
    except Exception as e:
        return jsonify({
            "message": "Error al generar el código QR",
            "error": str(e)
        }), 500