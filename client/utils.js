export const isUsernameValid = (username) => {
    const regex = /^[a-zA-Z0-9]{3,16}$/;
    return regex.test(username);
}

export const isPasswordValid = (password) => {
    const regex = /^[a-zA-Z0-9]{3,16}$/;
    return regex.test(password);
}