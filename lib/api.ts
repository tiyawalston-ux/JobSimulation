// Calls one of the app's API routes, asking the player for the access code if the server requires one.
export async function postJSON(url: string, body: unknown): Promise<Response> {
  const send = () =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-access-code": readCode() },
      body: JSON.stringify(body),
    });

  let res = await send();
  while (res.status === 401) {
    const entered = window.prompt("This app is invite-only for now. Enter your access code:");
    if (entered === null) break;
    saveCode(entered.trim());
    res = await send();
  }
  return res;
}

function readCode(): string {
  try {
    return localStorage.getItem("dayone:access-code") ?? "";
  } catch {
    return "";
  }
}

function saveCode(code: string) {
  try {
    localStorage.setItem("dayone:access-code", code);
  } catch {}
}
