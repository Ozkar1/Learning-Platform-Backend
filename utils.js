function generateJoinCode() {
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += Math.floor(Math.random() * 10); // Generate a random digit and append it
    }
    return code;
}

module.exports = { generateJoinCode };