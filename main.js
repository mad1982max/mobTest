window.onload = () => {
    let currentUser = '01';

    let totalRooms = ['product-04-X06-C','product-04-X06-D','product-04-X03-C','product-04-Y04-D','product-04-Y04-C','product-04-Y06-D','product-04-Y06-C','product-04-Y05-Ha','product-04-Y06-H','product-04-Y06-G','product-04-Y09-D','product-04-Y09-C','product-04-Y11-D','product-04-Y11-C','product-04-Y13-D','product-04-Y13-C','product-04-X13-D','product-04-X13-C','product-04-X-11-I','product-04-X11-C','product-04-X09-C','product-04-X09-D','product-04-X07-G', 'product-04-X11-D', 'product-04-X03-D', 'product-04-Y09-I', 'product-04-Y06-I'];

    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    let bookedSquaresArr = [
        {
            roomId: 'product-04-Y06-I',
            userId: '01'
        },
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

    let freeRooms = totalRooms.diff(bookedSquaresArr.map(val => val.roomId));
    console.log('freeRooms', freeRooms);

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
    svgInn.addEventListener("click", click);

    showBookedSquares();
    lightBookedSquares();
    lightFreeRooms();

    function  lightFreeRooms() {
        freeRooms.forEach(el => {
            let elSquare = svgDocument.getElementById(el);
            elSquare.firstElementChild.style.cssText = `fill: ${freeRoomsColor}; opacity: 0.7`;
        })
    }

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
        
        if(totalRooms.indexOf(squareId) === -1) {
            console.log('Not a room');
            alert.innerText = ' Not a room';
            return
        }

        let {index, isBookedByCurrentUser} = getBookedIndex(squareId);
        if(index > -1 && isBookedByCurrentUser) {
            unbookSquare(index);
            freeRooms.push(squareId);
            e.target.style.cssText = `fill: ${freeRoomsColor}; opacity: 0.7`;
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
//---------------------------------------------------------
        svgInn.addEventListener('mousemove', function(event) {
        pointer.innerHTML = event.clientX + ' : ' + event.clientY;
    });
//---------------------------------------------------------    
    zoom();
    function zoom () {
        let panZoomInstance = svgPanZoom(svgInn, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 1
        });

        panZoomInstance.zoom(0.3)
      }
}
//-----ZOOM--------------------

    // svgInn.onwheel = f;

    // function f(e) {
    //     console.log(e.deltaY);
    //     console.log(e.clientX, e.clientY);
    //     let [x, y, w, h] = svgInn.getAttribute('viewBox').split(' ');
    //     console.log(x, y, w, h);

    //     let pace = 40;
    //     let direction = e.deltaY > 0 ? pace: -pace;
        
    //     let sm = e.deltaY > 0 ? 3: -3;
    //     let n = w/(+w + direction);
    //     let cor = n*pace;
    //     let dirCor = e.deltaY > 0 ? cor: -cor;
    //     console.log('***', n, cor);

    //     let newData = `${+x-dirCor} ${+y-dirCor} ${+w + direction} ${+h + direction}`;
    //     console.log(newData)
    //     svgInn.setAttribute('viewBox', newData);
    //     svgInn5.setAttribute('viewBox', newData)

    // }