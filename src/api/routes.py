"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint, send_file
from datetime import datetime
import qrcode
import json
import os
from api.models import MedioPagoTipo, db, User, Contact, Group, SensitiveData, Reserva, TipoNif, Group, contact_group # Importar los modelos de la base de datos
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash #(Libreria que sirve para guardar una constraseña segura)
from io import BytesIO
import gzip
import base64


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)

        email = data.get('email')
        password = data.get('password')
        language = data.get('language')

        if not email or not password or not language:
            print("Datos incompletos")  
            return jsonify({"message": "Todos los campos son requeridos"}), 400

        if User.query.filter_by(email=email).first():
            print("Usuario ya existe")
            return jsonify({"message": "El usuario ya existe"}), 400

        hashed_password = generate_password_hash(password)
        print("Contraseña hasheada correctamente")

        new_user = User(
            email=email,
            password=hashed_password,
            language=language, 
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
        print(f"Error en el endpoint /signup: {str(e)}")
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
    token = create_access_token(identity=str(user.email))
    return(token)

@api.route('/user', methods=['GET'])
@jwt_required()  # Asegura que el usuario esté autenticado
def get_user():
    try:
        # Obtener el email desde el JWT
        user_email = get_jwt_identity()  # El email del usuario autenticado
        print(f"Usuario autenticado con email: {user_email}")  # Log para verificar el email

        if not user_email:
            # Si no se obtiene el email desde el JWT
            return jsonify({"message": "No se encontró el usuario autenticado en el token"}), 401

        # Buscar el usuario por email
        user = User.query.filter_by(email=user_email).first()

        if not user:
            # Si no se encuentra el usuario en la base de datos
            print(f"Usuario con email {user_email} no encontrado en la base de datos.")
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Si el usuario es encontrado, devolver la información serializada
        return jsonify(user.serialize()), 200

    except Exception as e:
        # Captura cualquier otro error y lo reporta
        print(f"Error al obtener el usuario: {str(e)}")
        return jsonify({"message": "Error al obtener el usuario", "error": str(e)}), 500
    
# FUNCTION para actualizar los datos del usuario autenticado
@api.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):  # Recibe el user_id desde la URL
    try:
        user_email = get_jwt_identity()  # Obtiene el email del usuario autenticado
        print(f"Usuario autenticado con email: {user_email}")  # Log para verificar el email

        # Buscar al usuario con el user_id proporcionado
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Obtener los datos enviados en el body de la solicitud
        data = request.get_json()

        # Actualizar los campos del usuario
        if "email" in data:
            user.email = data["email"]
        if "language" in data:
            user.language = data["language"]
        if "role" in data:
            user.role = data["role"]
        if "is_active" in data:
            user.is_active = data["is_active"]

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify(user.serialize()), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Error al actualizar el usuario", "error": str(e)}), 500

# FUNCTION para eliminar un usuario
@api.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()  # Asegura que el usuario esté autenticado
def delete_user(user_id):
    try:
        user_email = get_jwt_identity()  # Obtiene el email del usuario autenticado
        print(f"Usuario autenticado con email: {user_email}")  # Log para verificar el email

        # Buscar al usuario con el user_id proporcionado
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Eliminar el usuario
        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "Usuario eliminado exitosamente"}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Error al eliminar el usuario", "error": str(e)}), 500

@api.route('/backoffice')
@jwt_required()  # Asegura que el usuario esté autenticado
def backoffice():
    return jsonify({"message": "Acceso al Backoffice permitido."})

# FUNCION PARA CARGAR UN CONTACTO
@api.route('/contact', methods=['GET'])
@jwt_required()
def get_contacts():
    try:
        email = get_jwt_identity()  # Esto devolverá el email del usuario actual
        print(f"Usuario autenticado: {email}")  # Verifica que el email esté correcto

        user = User.query.filter_by(email=email).first()
        if not user:
            print("Usuario no encontrado")
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        user_id = user.id
        print(f"Usuario autenticado con ID: {user_id}")  # Verifica el ID del usuario

        contacts = Contact.query.filter_by(user_id=user_id).all()

        if not contacts:
            print("No se encontraron contactos.")
            return jsonify({"message": "No hay contactos disponibles"}), 404

        return jsonify([contact.serialize() for contact in contacts]), 200
    except Exception as e:
        print(f"Error al obtener los contactos: {e}")
        return jsonify({"message": "Error al obtener los contactos", "error": str(e)}), 500
    

# FUNCION PARA CREAR UN CONTACTO
@api.route('/contact', methods=['POST'])
@jwt_required()
def create_contact():
    try:
        email = get_jwt_identity()  # Obtener el email del usuario autenticado
        
        # Buscar el usuario en la base de datos usando el email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        # Obtener los datos del nuevo contacto
        data = request.get_json()

        # Crear el nuevo contacto
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
            user_id=user.id  # Aquí asignamos el ID del usuario autenticado
        )
        
        db.session.add(new_contact)
        db.session.commit()

        # Si el contacto no es admin, buscar un grupo existente o crear uno
        if not new_contact.is_admin:
            group = Group.query.filter_by(user_id=user.id).first()
            if group:
                # Si ya existe un grupo, asociamos el contacto al grupo
                group.contacts.append(new_contact)
                db.session.commit()
            else:
                # Si no existe un grupo, creamos uno nuevo
                new_group = Group(user_id=user.id, group_name="Grupo de Contactos")
                db.session.add(new_group)
                db.session.commit()
                new_group.contacts.append(new_contact)  # Asociamos el contacto al nuevo grupo
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
    
#FUNCION PARA EDITAR LOS DATOS DE UN CONTACTO
@api.route('/contact/<int:contact_id>', methods=['PUT'])
@jwt_required()
def update_contact(contact_id):
    try:
        # Obtener el email del usuario autenticado
        email = get_jwt_identity()

        # Buscar al usuario en la base de datos usando el email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        # Obtener el contacto a actualizar
        contact = Contact.query.get(contact_id)
        if not contact:
            return jsonify({"message": "Contacto no encontrado"}), 404
        
        # Verificar que el contacto pertenece al usuario autenticado
        if contact.user_id != user.id:
            return jsonify({"message": "No tienes permiso para actualizar este contacto"}), 403
        
        # Obtener los datos a actualizar
        data = request.get_json()

        # Actualizar los campos del contacto
        contact.nombre = data.get('nombre', contact.nombre)
        contact.primer_apellido = data.get('primer_apellido', contact.primer_apellido)
        contact.segundo_apellido = data.get('segundo_apellido', contact.segundo_apellido)
        contact.sexo = data.get('sexo', contact.sexo)
        contact.nacionalidad = data.get('nacionalidad', contact.nacionalidad)
        contact.fecha_nacimiento = datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date() if 'fecha_nacimiento' in data else contact.fecha_nacimiento
        contact.direccion = data.get('direccion', contact.direccion)
        contact.localidad = data.get('localidad', contact.localidad)
        contact.pais = data.get('pais', contact.pais)
        contact.email = data.get('email', contact.email)
        contact.telefono_movil = data.get('telefono_movil', contact.telefono_movil)
        contact.telefono_fijo = data.get('telefono_fijo', contact.telefono_fijo)

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({
            "message": "Contacto actualizado exitosamente",
            "contact": contact.serialize()
        }), 200
        
    except KeyError as e:
        return jsonify({
            "message": "Datos incompletos",
            "error": f"Falta el campo {str(e)}"
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error al actualizar el contacto",
            "error": str(e)
        }), 500

#FUNCION PARA ELIMINAR UN CONTACTO
@api.route('/contact/<int:contact_id>', methods=['DELETE'])
@jwt_required()
def delete_contact(contact_id):
    try:
        # Obtener el email del usuario autenticado
        email = get_jwt_identity()

        # Buscar al usuario en la base de datos usando el email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Buscar el contacto a eliminar
        contact = Contact.query.get(contact_id)
        if not contact:
            return jsonify({"message": "Contacto no encontrado"}), 404

        # Verificar que el contacto pertenece al usuario
        if contact.user_id != user.id:
            return jsonify({"message": "No tienes permiso para eliminar este contacto"}), 403

        # Desvincular el contacto de los grupos asociados
        for group in contact.grupos:  # Asegúrate de que 'grupos' es la relación que conecta con 'group'
            group.contacts.remove(contact)  # Elimina el contacto de la relación

        db.session.commit()  # Guarda los cambios

        # Ahora puedes eliminar el contacto sin problemas
        db.session.delete(contact)
        db.session.commit()

        return jsonify({"message": "Contacto eliminado exitosamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al eliminar el contacto", "error": str(e)}), 500

# FUNCION PARA CARGAR TODOS LOS GRUPOS
@api.route('/group', methods=['GET'])
@jwt_required()
def get_groups():
    try:
        # Obtener el email del usuario autenticado
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Obtener todos los grupos del usuario
        groups = Group.query.filter_by(user_id=user.id).all()

        if not groups:
            return jsonify({"message": "No hay grupos disponibles"}), 404

        # Agregar los contact_ids asociados a cada grupo
        group_data = []
        for group in groups:
            group_info = group.serialize()  # Serializa el grupo
            # Solo obtener los contact_ids
            group_info['contact_ids'] = [contact.id for contact in group.contacts]
            group_data.append(group_info)

        return jsonify(group_data), 200
    except Exception as e:
        return jsonify({"message": "Error al obtener los grupos", "error": str(e)}), 500


# FUNCION PARA CREAR UN GRUPO
@api.route('/group', methods=['POST'])
@jwt_required()
def create_group():
    try:
        email = get_jwt_identity()  # Obtener el email del usuario autenticado
        
        # Buscar el usuario en la base de datos usando el email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Obtener los datos del nuevo grupo (nombre por defecto: 'Grupo de Contactos')
        data = request.get_json()
        group_name = data.get('group_name', 'GRUPO DE CONTACTOS')

        # Verificar si ya existe un grupo para este usuario
        existing_group = Group.query.filter_by(user_id=user.id).first()
        if existing_group:
            return jsonify({"message": "El usuario ya tiene un grupo"}), 400

        # Crear el nuevo grupo
        new_group = Group(user_id=user.id, group_name=group_name)

        db.session.add(new_group)
        db.session.commit()

        # Si se ha creado un contacto, lo asociamos al nuevo grupo
        contact_id = data.get('contact_id')
        if contact_id:
            contact = Contact.query.get(contact_id)
            if contact:
                new_group.contacts.append(contact)  # Agrega el contacto al grupo
                db.session.commit()

        return jsonify({
            "message": "Grupo creado exitosamente",
            "group": new_group.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error al crear el grupo",
            "error": str(e)
        }), 500

# FUNCION PARA ACTUALIZAR UN GRUPO
@api.route('/group/<int:group_id>', methods=['PUT'])
@jwt_required()
def update_group(group_id):
    try:
        user_email = get_jwt_identity()  # Obtener el email del usuario autenticado
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Buscar el grupo por ID
        group = Group.query.get(group_id)
        if not group:
            return jsonify({"message": "Grupo no encontrado"}), 404

        # Verificar que el grupo pertenece al usuario autenticado
        if group.user_id != user.id:
            return jsonify({"message": "No tienes permiso para actualizar este grupo"}), 403

        # Obtener los datos enviados para actualizar
        data = request.get_json()

        # Actualizar el nombre del grupo
        group.group_name = data.get('group_name', group.group_name)

        # Eliminar contactos actuales del grupo
        group.contacts.clear()

        # Agregar los nuevos contactos al grupo
        contact_ids = data.get('contact_ids', [])
        for contact_id in contact_ids:
            contact = Contact.query.get(contact_id)
            if contact and contact.user_id == user.id:  # Verificar que el contacto pertenece al mismo usuario
                group.contacts.append(contact)

        db.session.commit()

        return jsonify({
            "message": "Grupo actualizado exitosamente",
            "group": group.serialize()  # Devolver el grupo actualizado
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar el grupo", "error": str(e)}), 500


# FUNCION PARA ELIMINAR UN GRUPO
@api.route('/group/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    try:
        email = get_jwt_identity()  # Obtener el email del usuario autenticado
        
        # Buscar el usuario en la base de datos usando el email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        # Buscar el grupo por su ID
        group = Group.query.get(group_id)
        if not group:
            return jsonify({"message": "Grupo no encontrado"}), 404
        
        # Verificar que el grupo pertenece al usuario
        if group.user_id != user.id:
            return jsonify({"message": "No tienes permiso para eliminar este grupo"}), 403
        
        # Eliminar el grupo
        db.session.delete(group)
        db.session.commit()

        return jsonify({
            "message": f"Grupo con ID {group_id} eliminado exitosamente"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error al eliminar el grupo",
            "error": str(e)
        }), 500

# FUNCION PARA CARGAR LOS DATOS SENSIBLES FILTRADOS POR 'user_id'
@api.route('/sensitive-data', methods=['GET'])
@jwt_required()
def get_sensitive_data():
    try:
        # Obtener el email del usuario autenticado
        email = get_jwt_identity()

        # Obtener el user_id basado en el email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Obtener todos los contactos del usuario
        contacts = Contact.query.filter_by(user_id=user.id).all()
        if not contacts:
            return jsonify({"message": "No se encontraron contactos para este usuario"}), 404
        
        # Obtener todos los datos sensibles asociados a estos contactos
        sensitive_data = SensitiveData.query.filter(SensitiveData.contact_id.in_([contact.id for contact in contacts])).all()
        
        if not sensitive_data:
            return jsonify({"message": "No se encontraron datos sensibles para los contactos del usuario"}), 404

        return jsonify([data.serialize() for data in sensitive_data]), 200
    except Exception as e:
        return jsonify({"message": "Error al obtener los datos sensibles", "error": str(e)}), 500

# FUNCTION para guardar los datos sensibles
@api.route('/sensitive-data', methods=['POST'])
@jwt_required()
def create_sensitive_data():
    try:
        data = request.get_json()
        
        # Obtener el email del usuario autenticado
        email = get_jwt_identity()

        # Buscar el usuario por su email y obtener su user_id
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"message": "Usuario no encontrado o no autorizado"}), 404
        
        # Obtener el user_id del usuario autenticado
        user_id = user.id

        # Verificar que el contacto existe y pertenece al usuario actual
        contact = Contact.query.filter_by(id=data['contact_id'], user_id=user_id).first()

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
        
        # Crear los datos sensibles
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

# Ruta para actualizar los datos sensibles
@api.route('/sensitive-data/<int:sensitive_data_id>', methods=['PUT'])
@jwt_required()
def update_sensitive_data(sensitive_data_id):
    try:
        # Obtener el email del usuario autenticado
        email = get_jwt_identity()

        # Buscar el usuario por su email y obtener su user_id
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"message": "Usuario no encontrado o no autorizado"}), 404
        
        # Obtener el user_id del usuario autenticado
        user_id = user.id

        # Buscar el dato sensible por su id
        sensitive_data = SensitiveData.query.filter_by(id=sensitive_data_id).first()

        if not sensitive_data:
            return jsonify({"message": "Datos sensibles no encontrados"}), 404

        # Verificar que el contacto pertenece al usuario
        contact = Contact.query.filter_by(id=sensitive_data.contact_id, user_id=user_id).first()
        if not contact:
            return jsonify({"message": "Contacto no autorizado para este usuario"}), 403
        
        # Actualizar los campos del dato sensible
        data = request.get_json()

        # Validar tipo de NIF
        try:
            nif_tipo = TipoNif[data['nif_tipo']]
        except KeyError:
            return jsonify({
                "message": "Tipo de NIF inválido",
                "valid_types": [tipo.name for tipo in TipoNif]
            }), 400

        sensitive_data.nif_tipo = nif_tipo
        sensitive_data.nif_numero = data['nif_numero']
        sensitive_data.nif_country = data['nif_country']

        db.session.commit()

        return jsonify({
            "message": "Datos sensibles actualizados correctamente",
            "sensitive_data": sensitive_data.serialize()
        }), 200

    except KeyError as e:
        return jsonify({
            "message": "Datos incompletos",
            "error": f"Falta el campo {str(e)}"
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error al actualizar los datos sensibles",
            "error": str(e)
        }), 500

# FUNCTION para eliminar los datos sensibles
@api.route('/sensitive-data/<int:sensitive_data_id>', methods=['DELETE'])
@jwt_required()
def delete_sensitive_data(sensitive_data_id):
    try:
        # Obtener el email del usuario autenticado
        email = get_jwt_identity()

        # Buscar el usuario por su email y obtener su user_id
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"message": "Usuario no encontrado o no autorizado"}), 404
        
        # Obtener el user_id del usuario autenticado
        user_id = user.id

        # Buscar el dato sensible por su id
        sensitive_data = SensitiveData.query.filter_by(id=sensitive_data_id).first()

        if not sensitive_data:
            return jsonify({"message": "Datos sensibles no encontrados"}), 404

        # Verificar que el contacto pertenece al usuario
        contact = Contact.query.filter_by(id=sensitive_data.contact_id, user_id=user_id).first()
        if not contact:
            return jsonify({"message": "Contacto no autorizado para este usuario"}), 403

        # Eliminar los datos sensibles
        db.session.delete(sensitive_data)
        db.session.commit()

        return jsonify({
            "message": "Datos sensibles eliminados correctamente"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error al eliminar los datos sensibles",
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
            return jsonify({"message": "Viajero no encontrado o no autorizado"}), 404

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
    
# FUNCION GENERAR QR INDIVIDUAL
@api.route('/contact/<int:contact_id>/qr', methods=['GET'])
@jwt_required()
def generate_contact_qr(contact_id):
    try:
        current_user_id = get_jwt_identity()  # Obtener el ID del usuario autenticado
        
        # Validar que el user_id del token es un número
        if not current_user_id.isdigit():
            return jsonify({"message": "Identidad del usuario inválida"}), 401  # Token corrupto

        current_user_id = int(current_user_id)  # Convertir a integer

        # Buscar el contacto asociado al usuario
        contact = Contact.query.filter_by(
            id=contact_id,
            user_id=current_user_id
        ).first()
        
        if not contact:
            return jsonify({"message": "Contacto no encontrado o no autorizado"}), 404
            
        # Obtener datos sensibles y reservas
        sensitive_data = SensitiveData.query.filter_by(contact_id=contact_id).first()
        reservas = Reserva.query.filter_by(traveler_id=contact_id).all()
        
        # Construir datos para el QR
        qr_data = {
            "contact": contact.serialize(),
            "sensitive_data": sensitive_data.serialize() if sensitive_data else None,
            "reservas": [reserva.serialize() for reserva in reservas] if reservas else []
        }
        
        # Generar QR
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json.dumps(qr_data))
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return send_file(
            img_buffer,
            mimetype='image/png',
            as_attachment=True,
            download_name=f'contact_{contact_id}_qr.png'
        )
        # Comprobar los datos del QR
        # return jsonify(qr_data), 200
        
    except Exception as e:
        return jsonify({"message": "Error al generar el QR", "error": str(e)}), 500
    
# FUNCION QR TODOS LOS CONTACTOS
@api.route('/group/<int:group_id>/qr', methods=['GET'])
@jwt_required()
def generate_group_qr(group_id):
    try:
        current_user_id = get_jwt_identity()
        try:
            current_user_id = int(current_user_id)
        except (ValueError, TypeError):
            return jsonify({"message": "Identidad del usuario inválida"}), 401

        group = Group.query.filter_by(id=group_id, user_id=current_user_id).first()
        if not group:
            return jsonify({"message": "Grupo no encontrado o no autorizado"}), 404

        contacts = (
            Contact.query
            .join(contact_group, contact_group.c.contact_id == Contact.id)
            .filter(contact_group.c.group_id == group_id)
            .options(db.joinedload(Contact.sensitive_data))
            .options(db.joinedload(Contact.reservas))
            .all()
        )

        # Construir los datos sin modificar nombres
        group_data = []
        for contact in contacts:
            group_data.append({
                "contact": contact.serialize(),
                "sensitive_data": contact.sensitive_data.serialize() if contact.sensitive_data else None,
                "reservas": [reserva.serialize() for reserva in contact.reservas] if contact.reservas else []
            })

        # Convertir a JSON
        json_data = json.dumps(group_data)
        print(f"Tamaño del JSON antes de compresión: {len(json_data)} caracteres")

        # Comprimir con gzip
        compressed_data = gzip.compress(json_data.encode('utf-8'))
        
        # Convertir a base64
        encoded_data = base64.b64encode(compressed_data).decode('utf-8')

        print(f"Tamaño después de compresión y base64: {len(encoded_data)} caracteres")

        # Si el tamaño sigue siendo demasiado grande, devolver error
        if len(encoded_data) > 2953:
            return jsonify({"message": "El contenido del QR sigue siendo demasiado grande"}), 400

        # Generar QR con la data comprimida y codificada
        qr = qrcode.QRCode(
            version=40,
            error_correction=qrcode.constants.ERROR_CORRECT_H,  # Máxima corrección de errores
            box_size=10,
            border=4,
        )
        qr.add_data(encoded_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)

        return send_file(
            img_buffer,
            mimetype='image/png',
            as_attachment=True,
            download_name=f'group_{group_id}_qr.png'
        )

    except Exception as e:
        return jsonify({"message": "Error al generar el QR grupal", "error": str(e)}), 500