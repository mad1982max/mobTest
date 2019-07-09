
window.onload = () => {
    let currentUser = '01';
    let bookedSquaresArr = [
        {
            roomId: 'product-04-X06-C',
            userId: '01'
        },
        {
            roomId: 'product-04-X11-D',
            userId: '02'
        },
        {
            roomId: 'product-04-X03-D',
            userId: '03'
        },
        {
            roomId: 'product-04-Y09-I',
            userId: '05'
        }
    ];
    let currentUserColor = 'blue';
    let freeRoomsColor = 'green';
    let bookedAnotherUserColor = 'red';


    let obj = document.getElementById("svgObj1");
    let svgDocument = obj.contentDocument;
    let svgInn = svgDocument.getElementById("svg1");
    let roomNo = document.getElementById("roomNo");
    let bookedByCurrent = document.getElementById("bookedByCurrent");
    let bookedByAnother = document.getElementById("bookedByAnother");
    let alert = document.getElementById("alert");
    let wrapper = document.getElementById('wrapper');
    svgInn.addEventListener("click", click);

    showBookedSquares();
    lightBookedSquares();

    function lightBookedSquares() {
        bookedSquaresArr.forEach(el => {
            let elSquare = svgDocument.getElementById(el.roomId);
            if(el.userId === currentUser) {
                elSquare.firstElementChild.style.cssText = `fill: ${currentUserColor}; opacity: 0.7`;
            } else {
                elSquare.firstElementChild.style.cssText = `fill: ${bookedAnotherUserColor}; opacity: 0.7`;
            }
        })
    }

    function showCurrentSquare(id) {
        roomNo.innerText = id;
    }

    function showBookedSquares() {
        let currentBooked = bookedSquaresArr.filter(val => val.userId === currentUser).map(val => val.roomId).toString();;
        let anotherBooked = bookedSquaresArr.filter(val => val.userId !== currentUser).map(val => val.roomId).toString();
        bookedByCurrent.innerText = currentBooked;
        bookedByAnother.innerText = anotherBooked;
    }

    function bookSquare(id) {
        bookedSquaresArr.push({roomId: id,  userId: currentUser});
    }

    function unbookSquare(index) {
        bookedSquaresArr.splice(index, 1);
    }

    function getBookedIndex(id) {
        let isBookedByCurrentUser;
        let index = bookedSquaresArr.findIndex(val => {
            isBookedByCurrentUser = (val.userId === currentUser)? true: false
            return val.roomId === id
        })
        return {index, isBookedByCurrentUser}
    }

    function click(e) {
        let squareId = e.target.parentElement.id;
        showCurrentSquare(squareId);        

        let {index, isBookedByCurrentUser} = getBookedIndex(squareId);
        if(index > -1 && isBookedByCurrentUser) {
            unbookSquare(index);
            e.target.style.cssText = `fill: none; opacity: 0.1; pointer-events: visible;`
            alert.innerText = '';
        } else if(index > -1 && !isBookedByCurrentUser) {
            console.log('Its not your room');
            alert.innerText = ' Not you booked this room'
            
        } else {
            bookSquare(squareId);
            e.target.style.cssText =  `fill: ${currentUserColor}; opacity: 0.7`;
            alert.innerText = '';
        }
        showBookedSquares();
    }

}