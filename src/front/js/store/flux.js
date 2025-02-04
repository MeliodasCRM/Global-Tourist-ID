const { Col } = require("react-bootstrap");

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			authToken: localStorage.getItem("authToken") || null, // Inicializamos con el token del localStorage
			role: null, //inicilizo el rol del usuario
			user: [], // inicializo el usuario
			contact: [], // inicialdatos de contactos
			sensitive_data: [], //inicializo los datos sensibles
			group: [], // Incializo el array de grupos
			activeContactId: null, // Inicializo el contacto activo
			contactToEdit: null, // Inicializo el contacto a editar

		},
		actions: {

			// Acción para cargar el usuario en el store
			signup: async (email, password, language) => {
				try {
					// Llamamos a la API para crear el usuario
					const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password, language }),
					});

					if (resp.ok) {
						// Si el registro es exitoso, obtenemos el token
						const data = await resp.json();
						console.log("Usuario registrado exitosamente");

						// Ahora obtenemos el token JWT
						const token = await resp.text();
						localStorage.setItem("authToken", token);
						setStore({ authToken: token });

						return { success: true, message: "Registro exitoso" };
					} else {
						const error = await resp.json();
						console.error("Error en el registro:", error);
						return { success: false, message: error.message || "Error en el registro" };
					}
				} catch (err) {
					console.error("Error en signup:", err);
					return { success: false, message: "Error de conexión" };
				}
			},

			// Use getActions to call a function within a fuction
			login: async (email, password) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});

					if (resp.ok) {
						const token = await resp.text();
						localStorage.setItem("authToken", token);
						setStore({ authToken: token });

						// Llamamos a la nueva acción para cargar los datos del usuario después de hacer login
						await getActions().loadUser();

						return { success: true, message: "Login exitoso" };
					} else {
						const error = await resp.json();
						return { success: false, message: error.message || "Error en el login" };
					}
				} catch (err) {
					console.error("Error en login:", err);
					return { success: false, message: "Error de conexión" };
				}
			},

			// Función loadUser en el frontend
			loadUser: async () => {
				const store = getStore();

				// Imprime el estado de store.user para verificar si está correcto
				console.log("Estado de store.user antes de cargar el usuario:", store.user);

				if (!store.authToken) {
					console.error("Token JWT no disponible");
					return;
				}

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`, // Usamos el token JWT para la autorización
						},
					});

					if (response.ok) {
						// Al recibir la respuesta, parseamos los datos
						const user = await response.json();
						console.log("Datos del usuario cargados:", user);

						setStore({ user: user });  // Actualizamos el store con los datos del usuario

						// Verifica los valores antes de hacer la comparación
						console.log("store.user.id:", store.user.id);
						console.log("user.id del backend:", user.id);

						// Verificamos que el user_id corresponda al del usuario logeado
						if (user.id === store.user.id) {
							console.log("Usuario cargado correctamente");
						} else {
							console.error("Los datos del usuario no coinciden con el usuario logeado");
						}
					} else {
						console.error("Error al cargar el usuario");
					}
				} catch (error) {
					console.error("Error al cargar el usuario:", error);
				}
			},

			logout: () => {
				localStorage.removeItem("authToken");  // Eliminamos el token del localStorage
				setStore({ authToken: null });  // Actualizamos el store para eliminar el token
				console.log("Usuario deslogueado exitosamente.");
			},

			// Acción para cargar los contactos del usuario logueado
			loadContacts: async () => {
				const store = getStore();

				if (!store.authToken) {
					console.error("Token JWT no disponible");
					return;
				}

				try {
					// Hacemos la llamada para obtener los contactos
					const response = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,  // Enviamos el token JWT para autenticar al usuario
						},
					});

					if (response.ok) {
						const contacts = await response.json();

						// Filtramos los contactos para obtener solo los que corresponden al usuario logueado
						const userContacts = contacts.filter(contact => contact.user_id === store.user.id);

						console.log("Contactos cargados para el usuario:", userContacts);
						setStore({ contact: userContacts });  // Actualizamos el store con los contactos filtrados
					} else {
						console.error("Error al cargar los contactos");
						const errorResponse = await response.json();
						console.log("Error al cargar contactos:", errorResponse);
					}
				} catch (error) {
					console.error("Error al cargar los contactos:", error);
				}
			},

			// Acción para crear un contacto y gestionar si es admin y el grupo
			createContact: async (formData, sensitiveFormData) => {
				const store = getStore();
				try {
					const contactResponse = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
						body: JSON.stringify({
							...formData,
							is_admin: store.contact.length === 0,
							user_id: store.user.id
						}),
					});
			
					if (!contactResponse.ok) {
						throw new Error("Error al crear el contacto");
					}
			
					const responseData = await contactResponse.json();
					console.log("Response data:", responseData);
			
					// Extract contact from response
					const newContact = responseData.contact;
					console.log("Nuevo contacto:", newContact);
			
					if (!newContact || !newContact.id) {
						throw new Error("ID de contacto no recibido en la respuesta");
					}
			
					setStore({ contact: [...store.contact, newContact] });
			
					// Create sensitive data if form has data
					if (sensitiveFormData && newContact.id) {
						console.log("Creating sensitive data for contact ID:", newContact.id);
						await getActions().createSensitiveData(newContact.id, sensitiveFormData);
					}
			
					return newContact;
				} catch (error) {
					console.error("Error en createContact:", error);
					throw error;
				}
			},
			
			createSensitiveData: async (contactId, sensitiveFormData) => {
				const store = getStore();
				try {
					console.log("Contact ID recibido:", contactId); // Debug log
					console.log("Sensitive Form Data:", sensitiveFormData); // Debug log
			
					if (!contactId || typeof contactId !== 'number') {
						throw new Error(`Contact ID invalid: ${contactId}`);
					}
			
					const sensitiveData = {
						nif_tipo: sensitiveFormData.nif_tipo || "TIE",
						nif_numero: sensitiveFormData.nif_numero || "",
						nif_country: sensitiveFormData.nif_country || "",
						contact_id: contactId
					};
			
					const response = await fetch(`${process.env.BACKEND_URL}/api/sensitive-data`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
						body: JSON.stringify(sensitiveData),
					});
			
					const responseData = await response.json();
					console.log("Sensitive data response:", responseData); // Debug log
			
					if (!response.ok) {
						throw new Error(responseData.message || "Error al crear datos sensibles");
					}
			
					setStore({
						sensitive_data: [...store.sensitive_data, responseData]
					});
			
					return responseData;
				} catch (error) {
					console.error("Error en createSensitiveData:", error);
					throw error;
				}
			},

			// Acción para modificar los datos de un contacto
			updateContact: async (contactId, formData) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/contact/${contactId}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
						body: JSON.stringify(formData),
					});

					if (response.ok) {
						const updatedContact = await response.json();
						// Actualizar la lista de contactos en el store
						const updatedContacts = store.contact.map(contact =>
							contact.id === contactId ? updatedContact : contact
						);
						setStore({ contact: updatedContacts });
						console.log("Datos del contacto actualizados correctamente:", updatedContact);
					} else {
						console.error("Error al actualizar los datos del contacto");
					}
				} catch (err) {
					console.error("Error al actualizar los datos del contacto:", err);
				}
			},

			// Acción para eliminar un contacto
			deleteContact: async (contactId) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/contact/${contactId}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
					});

					if (response.ok) {
						const deletedContact = await response.json();
						// Eliminar el contacto del store
						const remainingContacts = store.contact.filter(contact => contact.id !== contactId);
						setStore({ contact: remainingContacts });
						console.log("Contacto eliminado correctamente:", deletedContact);
					} else {
						console.error("Error al eliminar contacto");
					}
				} catch (err) {
					console.error("Error al eliminar contacto:", err);
				}
			},

			// Acción para crear un nuevo grupo
			createGroup: async (contactId) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/group`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
						body: JSON.stringify({
							contact_id: contactId,
							name: "GRUPO",  // Este es un nombre por defecto, puedes personalizarlo
						}),
					});
					if (response.ok) {
						const group = await response.json();
						setStore({ group: [...store.group, group] });  // Actualizamos el store con el nuevo grupo
					}
				} catch (err) {
					console.error("Error al crear grupo:", err);
				}
			},

			// Acción para agregar un contacto al grupo
			addToGroup: async (contactId, groupId) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/group/${groupId}/contact/${contactId}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
					});

					if (response.ok) {
						const group = store.groups.find((g) => g.id === groupId);
						if (group) {
							group.contacts.push(contactId);  // Agrega el nuevo contacto al grupo
							setStore({ groups: [...store.groups] });
						}
					}
				} catch (err) {
					console.error("Error al agregar contacto al grupo:", err);
				}
			},

			// Acción para cargar datos sensibles en el store
			loadSensitiveData: async () => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/sensitive-data`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
					});

					if (response.ok) {
						const sensitiveData = await response.json();
						console.log("Datos sensibles cargados:", sensitiveData);  // Verifica si los datos sensibles están llegando
						setStore({ sensitive_data: sensitiveData });  // Actualiza el store con los datos sensibles
					} else {
						console.error("Error al cargar los datos sensibles");
					}
				} catch (error) {
					console.error("Error al cargar los datos sensibles:", error);
				}
			},

			// Acción para eliminar los datos sensibles de un contacto
			deleteSensitiveData: (contactId) => {
				return async (dispatch) => {
					try {
						// Hacer la petición para eliminar los datos sensibles del backend
						const response = await fetch(`/api/sensitive-data/${contactId}`, {
							method: 'DELETE',
							headers: {
								'Content-Type': 'application/json',
							},
						});

						if (!response.ok) {
							throw new Error('No se pudo eliminar los datos sensibles');
						}

						// Si la eliminación fue exitosa, actualizamos el store
						dispatch({
							type: 'DELETE_SENSITIVE_DATA',
							payload: contactId,  // Enviamos el ID del contacto eliminado
						});

						// También recargamos los datos si es necesario
						// dispatch(actions.loadSensitiveData()); // Si es necesario recargar los datos sensibles

					} catch (error) {
						console.error("Error al eliminar los datos sensibles:", error);
					}
				};
			},

			// Acción para actualizar los datos sensibles de un contacto
			updateSensitiveData: (contactId, updatedData) => {
				return async (dispatch) => {
					try {
						// Hacer la solicitud para actualizar los datos sensibles en el backend
						const response = await fetch(`/api/sensitive-data/${contactId}`, {
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(updatedData), // Enviamos los datos actualizados
						});

						if (!response.ok) {
							throw new Error('No se pudo actualizar los datos sensibles');
						}

						// Si la actualización fue exitosa, actualizamos el store
						dispatch({
							type: 'UPDATE_SENSITIVE_DATA',
							payload: { contactId, updatedData },  // Pasamos el ID y los nuevos datos
						});

						// También podrías querer recargar los datos sensibles si es necesario
						// dispatch(actions.loadSensitiveData()); // Si es necesario recargar

					} catch (error) {
						console.error("Error al actualizar los datos sensibles:", error);
					}
				};
			},

			// Acción para establecer el contacto a editar
			setContactToEdit: (contact) => {
				setStore({ contactToEdit: contact });
			},

			// Acción para limpiar el contacto a editar
			clearContactToEdit: () => {
				setStore({ contactToEdit: null });
			},


		},
	};
};

export default getState;