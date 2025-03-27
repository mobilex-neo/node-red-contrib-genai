const axios = require("axios");

class GenaiClient {
  constructor(baseURL, auth = {}) {
    this.baseURL = baseURL;
    this.auth = auth; // { token: '', apiKey: '', apiSecret: '' }
    this.token = null;

    this.api = axios.create({ baseURL });

    this._applyAuthHeaders();
  }

  _applyAuthHeaders() {
    const headers = {};
 
    
    if (this.auth.apiKey && this.auth.apiSecret) {
      // API Key + Secret
      headers["Authorization"] = `token ${this.auth.apiKey}:${this.auth.apiSecret}`;
    }
    else if (this.auth.token) {
       // Cookie-based (session)
      headers["Cookie"] = this.auth.token;
    }

   
    this.api.defaults.headers = {
      ...this.api.defaults.headers,
      ...headers
    };
  }

  async login(username, password) {
    const res = await this.api.post("/api/login", {
      usr: username,
      pwd: password
    });

    this.token = res.headers["set-cookie"];
    this.auth.token = this.token;
    this._applyAuthHeaders();
    return this.token;
  }

  async getDoc(doctype, name) {
    const res = await this.api.get(`/api/resource/${doctype}/${name}`);
    return res.data.data;
  }

  async createDoc(doctype, data) {
    const res = await this.api.post(`/api/resource/${doctype}`, data);
    return res.data.data;
  }

  async updateDoc(doctype, name, data) {
    const res = await this.api.put(`/api/resource/${doctype}/${name}`, data);
    return res.data.data;
  }

  async deleteDoc(doctype, name) {
    const res = await this.api.delete(`/api/resource/${doctype}/${name}`);
    return res.data;
  }

}

module.exports = GenaiClient;