const colors = [
'#f94144',
'#f3722c',
'#f8961e',
'#f9844a',
'#f9c74f',
'#90be6d',
'#43aa8b',
'#4d908e',
'#577590',
'#277da1',

'#A72525',
'#43AE5A',
'#43378A',
'#239588',
'#ADBE60',
]

export const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const getColor = () => shuffle(colors)[0]
