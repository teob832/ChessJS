//Variables
//********************************
var cells = document.getElementsByClassName('square'); 
var pieceSelected = false;
var currentLoc = "";
var newLoc = "";
var turn = 1;       //0 for black, 1 for white 

//Bind each cell/square
//********************************
for (var i = 0; i < cells.length; ++i)
    cells[i].onclick = takeAction;






//Take action
//********************************
function takeAction()
{
    var c = 0;
    var r = 0;
    var c1 = 0;
    var r1 = 0;


    //If a piece is not selected yet
    if (pieceSelected == false)
    {
        //Select this piece
        currentLoc = this.id;       
        c = toNumber(currentLoc[0]);
        r = parseInt(currentLoc[1]);


        //Verify that the selected piece belongs to player
        if ((turn == 0 && islower(chess.getPiece(c,r))) ||
            (turn == 1 && isupper(chess.getPiece(c,r))))
        {
            pieceSelected = true;

            //Modify the appearance of the selected piece
            changeToSelected(currentLoc);
        }
    }

    //If one is already selected
    else
    {
        //Reclicking will de-select
        if (currentLoc == this.id)
        {
            //Reset flag
            pieceSelected = false;
            //Change color to default
            changeToDeselected(currentLoc);
            return;
        }
        
        //Select the square TO MOVE
        //-------------------------------------------------------
        newLoc = this.id;

        c = toNumber(currentLoc[0]);
        r = parseInt(currentLoc[1]);
        c1 = toNumber(newLoc[0]);
        r1 = parseInt(newLoc[1]);
        var enemy = (turn == 1) ? 0 : 1;

        //Reset flag
        pieceSelected = false;
        //Change color to default
        changeToDeselected(currentLoc);

        
        //Check if move is valid
        //-------------------------------------------------------
        if (chess.checkMove(turn,c,r,c1,r1) == false)
        {
            alert("Illegal Move!");
            return;
        }

        chess.move(c, r, c1, r1);
        console.log("Move Invoked");
        toggleTurn();
        chess.printBoard();


        //Check if the Opponent is CHECKED
        //-------------------------------------------------------
        if (chess.isChecked(enemy) == true)
        {
            if (chess.checkMate(enemy) == true)
                alert("*** CHECKMATE ! ***");
            else
                alert("*** CHECK! ***");
        }
    
    }
}//end-TakeAction






//Column -- number to letter
//********************************
function toLetter(col)
{
    switch(col)
    {
        case 0:
            return 'a';
        case 1:
            return 'b';
        case 2:
            return 'c';
        case 3:
            return 'd';
        case 4:
            return 'e';
        case 5:
            return 'f';
        case 6:
            return 'g';
        case 7:
            return 'h';
        default:
            return 'X';
    }
}


//Column -- letter to number
//********************************
function toNumber(col)
{
    switch(col)
    {
        case 'a':
            return 0;
        case 'b':
            return 1;
        case 'c':
            return 2;
        case 'd':
            return 3;
        case 'e':
            return 4;
        case 'f':
            return 5;
        case 'g':
            return 6;
        case 'h':
            return 7;

        default: 
            return -1;
    }
}


//Get chess piece
//********************************
function getPieceAscii(piece)
{
    switch(piece)
    {
        case 'r':
            return "&#9820";
        case 'n':
            return "&#9822";
        case 'b':
            return "&#9821";
        case 'q':
            return "&#9819";
        case 'k':
            return "&#9818";
        case 'p':
            return "&#9823";

        case 'R':
            return "&#9814";
        case 'N':
            return "&#9816";
        case 'B':
            return "&#9815";
        case 'Q':
            return "&#9813";
        case 'K':
            return "&#9812";
        case 'P':
            return "&#9817";
        case '*':
            return "";
        default:
            return "error getchesspiece";

    }
}


//IsLower
//********************************
function islower(x)
{
    if (x == '*')
        return false;

    if (x == x.toLowerCase())
        return true;
    else
        return false;
}


//IsUpper
//********************************
function isupper(x)
{
    if (x == '*')
        return false;

    if (x == x.toUpperCase())
        return true;
    else 
        return false;
}


//Capture Function -- FINISH ME
//********************************
function capture(r,c)
{
    console.log("Capture called");
}


//Change Color to Selected
//********************************
function changeToSelected(id)
{
    var square = document.getElementById(id);
    square.style.backgroundColor = "#4682b4";
}


//Change Color to Selected
//********************************
function changeToDeselected(id)
{
    var c = toNumber(id[0]);
    var r = parseInt(id[1]);
    var square = document.getElementById(id);

    //Determine background color
    if (r % 2 == c % 2)
        square.style.backgroundColor = "#fff";  //white
    else
        square.style.backgroundColor = "#999";  //black
}


//Toggle Turn
//********************************
function toggleTurn()
{
    if (turn == 0)
        turn = 1; 
    else
        turn = 0; 
}


//AreEnemies
//********************************
function areEnemies(c, c1)
{
    if((islower(c) && islower(c1)) ||
       (isupper(c) && isupper(c1))) 
        return false;
    else
        return true;
}




var chess = new Chess();
//chess.printBoard();

chess.printBoard();


var deb = document.getElementById("debugger");
