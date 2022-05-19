const TokenAuth = (token,type) => {
  return {
    headers: {
      "Content-Type": type ?  "multipart/form-data" : "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export default TokenAuth;
