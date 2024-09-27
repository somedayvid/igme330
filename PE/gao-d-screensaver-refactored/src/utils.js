export const getRandomColor = () =>{ const getByte = () => 55 + Math.round(Math.random() * 200);
    return `rgba(${getByte()}, ${getByte()}, ${getByte()}, .8)`;
}

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min; 
