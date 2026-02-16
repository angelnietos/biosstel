import AuthAPI from "./authAPI";

interface ContextValue {
  dataSources: {
    authAPI?: AuthAPI;
  };
}

export default ContextValue;
