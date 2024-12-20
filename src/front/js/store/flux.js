const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			login: async (email, password) => {
				try {
				  const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				  });
			  
				  if (resp.ok) {
					const token = await resp.text(); // Procesa la respuesta como texto, no como JSON
					localStorage.setItem("authToken", token);
					setStore({ authToken: token });
					return { success: true, message: "Login exitoso" };
				  } else {
					const error = await resp.json(); // Esto seguirá siendo válido para mensajes de error
					return { success: false, message: error.message || "Error en el login" };
				  }
				} catch (err) {
				  console.error("Error en login:", err);
				  return { success: false, message: "Error de conexión" };
				}
			  },
		
			  logout: () => {
				localStorage.removeItem("authToken");
				setStore({ authToken: null });
				console.log("Usuario deslogueado exitosamente.");
			  },
		
	  
			signup: async (email, password) => {
			  try {
				const resp = await fetch(process.env.BACKEND_URL + "api/signup", {
				  method: "POST",
				  headers: { "Content-Type": "application/json" },
				  body: JSON.stringify({ email, password }),
				});
	  
				if (resp.ok) {
				  const data = await resp.json();
				  return { success: true, message: "Registro exitoso" };
				} else {
				  const error = await resp.json();
				  return { success: false, message: error.message || "Error en el registro" };
				}
			  } catch (err) {
				console.error("Error en signup:", err);
				return { success: false, message: "Error de conexión" };
			  }
			}
		}
	};
};

export default getState;
