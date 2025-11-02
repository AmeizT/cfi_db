export function getAge(birthDate){
    if (!birthDate) {
        return undefined;
    }

    const currentDate = new Date();

    const birthDateObj = new Date(birthDate);
    const birthDay = birthDateObj.getDate();
    const birthMonth = birthDateObj.getMonth() + 1;
    const birthYear = birthDateObj.getFullYear();

    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let age = currentYear - birthYear;
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--
    }

    return `${age}y`
}
