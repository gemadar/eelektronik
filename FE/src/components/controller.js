import { redirect } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function getTokenDuration() {
  const token = jwtDecode(localStorage.getItem('a').toString());
  const expiration = new Date(token.exp * 1000);
  const now = new Date();
  const duration = expiration.getTime() - now.getTime();
  return duration;
}

function getAuthToken() {
  const token = localStorage.getItem('a');

  return token;
}

function tokenLoader() {
  return getAuthToken();
}

function getToken() {
  const token = getAuthToken();
  return token ? jwtDecode(token) : '';
}

export default function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect('/auth');
  }
}

const deleteCont = async (data, url) => {
  const endpoint = url;
  const token = getAuthToken();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ id: data })
  };
  await fetch(endpoint, requestOptions).then((response) => response.json());
};

async function getCont(url) {
  const token = getAuthToken();

  const data = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token } }).then(
    (res) => res.json()
  );
  return data;
}

async function insertUpdateCont(data, url) {
  const token = getAuthToken();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(data)
  };
  await fetch(url, requestOptions);
}

async function insertUpdateContNoToken(data, url) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  await fetch(url, requestOptions);
}

export { deleteCont, getCont, insertUpdateCont, getAuthToken, tokenLoader, getToken, getTokenDuration, insertUpdateContNoToken };
