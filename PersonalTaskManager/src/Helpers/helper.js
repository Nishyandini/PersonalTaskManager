export function getLocalStorageItem(key) {
    try {
        let data = localStorage.getItem(key);
        if(key === 'board') {
            data = data.split(',');
        } else if (key === 'lastcreatedlistid'|| key === 'boardtitle') {
            return data;
        } else {
            data = JSON.parse(data);   
        }
        return data;
    } catch (error) {
        console.log(error);
    }
}

export function setLocalStorageItem(key, data) {
    try {
        let saveData;
        if (Array.isArray(data)) {
            saveData = data.toString();
        } else {
            saveData = typeof data === 'string' ? data : JSON.stringify(data);
        }
        localStorage.setItem(key, saveData);
    } catch (error) {
        console.log(error);
    }
}

export function getCurrentDate () {
    try {
        const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let date = new Date();
        let month = monthList[date.getMonth()];
        let year = date.getFullYear();
        let day = date.getUTCDate();
        return (`${day}-${month}-${year}`);
    } catch (error) {
        console.log(error);
    }
}

export function getNumberFromString (value) {
    let number = value && value.split(/(\d+)/);
    console.log(value,'',number);
    number = Array.isArray(number) ? number[number.length-2] : 0;
    console.log(number)
    return parseInt(number)+1;
}

export function getCardNumber(cardId) {

}

export function reorderArray (array, startIndex, endIndex) {
    const result = Array.from(array);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
}