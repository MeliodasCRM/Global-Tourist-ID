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

		},
		actions: {
			setAuthToken: (token) => {
				localStorage.setItem("authToken", token ? token : "");  // Guardamos el token en localStorage
				setStore({ authToken: token });  // Actualizamos el store con el token
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

			// Acción para cargar el usuario en el store
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
			createContact: async (formData) => {
				const store = getStore();
				try {
					// Verificamos si el usuario está cargado correctamente
					if (!store.user || !store.user.id) {
						console.error("El usuario no está cargado correctamente.");
						// Si el usuario no está cargado, esperamos un poco y lo intentamos de nuevo
						// o mostramos algún mensaje o redirigimos a login
						return;
					}
			
					// Verificar si el usuario ya tiene contactos
					const userContacts = store.contact.filter(contact => contact.user_id === store.user.id);
					// Verificar si el usuario tiene un grupo
					const userGroup = store.group.find(group => group.user_id === store.user.id);
			
					let contact;  // Definir la variable `contact` antes de usarla
			
					if (userContacts.length === 0) {
						// Crear el primer contacto como admin
						const response = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Authorization": `Bearer ${store.authToken}`,
							},
							body: JSON.stringify({
								...formData,
								is_admin: true,
								user_id: store.user.id,
							}),
						});
			
						if (response.ok) {
							contact = await response.json();  // Asignamos el contacto a la variable
							setStore({ contact: [contact] });
			
							// Si el usuario no tiene grupo, crearlo
							if (!userGroup) {
								await getActions().createGroup(contact.id);  // Crear un grupo si no existe
							}
						}
					} else {
						// Crear un contacto normal y asociarlo al grupo
						contact = userContacts[0];  // Usamos el primer contacto encontrado
			
						const response = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Authorization": `Bearer ${store.authToken}`,
							},
							body: JSON.stringify({
								...formData,
								is_admin: false,  // No es admin
								user_id: store.user.id,
							}),
						});
			
						if (response.ok) {
							const newContact = await response.json();
							setStore({ contact: [...store.contact, newContact] });
			
							// Asociar el nuevo contacto al grupo
							if (userGroup) {
								await getActions().addToGroup(newContact.id, userGroup.id);
							} else {
								// Crear grupo si no existe
								await getActions().createGroup(newContact.id);
							}
						}
					}
				} catch (err) {
					console.error("Error al crear contacto o grupo:", err);
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


		},
	};
};

export default getState;