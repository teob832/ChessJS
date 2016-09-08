//Chess -- prototype
//**********************************************************************
function Chess()
{
    //Board -- data member
    this.board = [
        ["*", "*", "*", "q", "k", "b", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "*", "P", "*", "*", "*", "*"],
        ["P", "P", "P", "*", "P", "P", "P", "P"],
        ["R", "N", "B", "Q", "K", "B", "N", "R"]
    ];

    //Captured Pieces -- data member
    this.captured = [];

    //King Locations
    this.king_loc = [[0,4], [7,4]];




    //PrintBoard -- replace each innerHTML 
    //***********************************
    this.printBoard = function()
    {
        var cap = document.getElementsByClassName("captured");
        var capturedBlack = "";
        var capturedWhite = "";

        /*
        //Display captured pieces
        for (var i = 0; i < this.captured.length; ++i)
        {
            if (islower(this.captured[i]))
                capturedBlack = capturedBlack + " " + getPieceAscii(this.captured[i]);
            else
                capturedWhite = capturedWhite + " " + getPieceAscii(this.captured[i]);

        }
        cap[0].innerHTML = capturedWhite;
        cap[1].innerHTML = capturedBlack;
        */
        


        //Display pieces on board
        for (var i = 0; i < 8; ++i)
        {
            for (var j = 0; j < 8; ++j)
            {
                var id = toLetter(j) + (i).toString();
                var square = document.getElementById(id);
                var piece = getPieceAscii(this.board[i][j]);

                square.innerHTML = piece;
            }
        }
    }//end-printBoard


    //Move Function
    //***********************************
    this.move = function(c,r,c1,r1)
    {
        //Make the move
        this.board[r1][c1] = this.board[r][c]; 
        this.board[r][c] = '*';
    }


    //CheckMove Function
    //***********************************
    this.checkMove = function(turn1, c, r, c1, r1)
    {
        if (this.legalMove(turn1,c,r,c1,r1) == false)
            return false;
        else if (this.exposesKing(turn1,c,r,c1,r1) == true)
            return false;
        else
            return true;
    }


    //LegalMove -- validate move
    //***********************************
    this.legalMove = function(turn1, c, r, c1, r1)
    {
        var piece = this.board[r][c];
    
        //Logic for each piece
        switch(piece)
        {
            //Pawn-Black
            case 'p':
            {
                //If blocked
                if (this.board[r1][c1] != '*')
                {
                    //if successful capture 
                    if (isupper(this.board[r1][c1]) && (r1 == r + 1) && (c1 == c - 1 || c1 == c + 1))                  
                    { 
                        this.captured.push(this.board[r1][c1]);
                        return true;
                    }
                    else
                        return false;
                }
                //If DOWN
                else if (c1 == c)
                {
                    //If DOWN once
                    if (r1 == r + 1)
                        return true;
                    //If DOWN twice from initial position
                    else if (r == 1 && r1 == r + 2)
                        return true;
                    else
                        return false;
                }
                //Anything else
                else 
                    return false;

                break;
            }//end-case 'p'


            //Pawn-White
            case 'P':
            {
                //If blocked
                if (this.board[r1][c1] != '*')
                {
                    //if successful capture 
                    if (islower(this.board[r1][c1]) && (r1 == r - 1) && (c1 == c - 1 || c1 == c + 1))                  
                    { 
                        this.captured.push(this.board[r1][c1]);
                        return true;
                    }
                    else
                        return false;
                }
                //If UP 
                else if (c1 == c)
                {
                    //If up once
                    if (r1 == r - 1)
                        return true;

                    //If UP twice from initial
                    else if (r == 6 && r1 == r - 2)
                        return true;

                    else
                        return false;
                }
                //Anything else
                else 
                    return false;

                break;
            }//end-white-pawn


            //Rook
            case 'r':
            case 'R':
            {
                var validPath = false;

                //Left-Right
                if (r1 == r)
                {
                    //Left -- check path
                    if (c1 < c)
                    {
                        for(var i = c - 1; i > c1; --i)
                        {
                            if (this.board[i][c1] != '*')
                                return false;
                        }
                    }
                    //Right -- check path
                    else if (c1 > c)
                    {
                        for(var i = c + 1; i < c1; ++i)
                        {
                            if (this.board[i][c1] != '*')
                                return false;
                        }
                    }
                    validPath = true;

                }//end-LeftRight

                //Up-Down
                else if (c1 == c && r1 != r)
                {
                    //Up
                    if (r1 < r)
                    {
                        for (var i = r - 1; i > r1; --i)
                        {
                            if (this.board[i][c1] != '*')
                                return false;
                        }
                    }
                    //Down
                    else if (r1 > r)
                    {
                        for (var i = r + 1; i < r1; ++i)
                        {
                            if (this.board[i][c1] != '*')
                                return false;
                        }
                    }
                    validPath = true;

                }//end-UpDown
                else
                    return false;

                //Validate
                if (validPath && this.board[r1][c1] != '*')
                {
                    if (islower(this.board[r][c]) && isupper(this.board[r1][c1]))
                    {
                        this.captured.push(this.board[r1][c1]);
                        return true;
                    }
                    else if (isupper(this.board[r][c]) && islower(this.board[r1][c1]))
                    {
                        this.captured.push(this.board[r1][c1]);
                        return true;
                    }
                    else
                        return false;
                }
                else if (validPath && this.board[r1][c1] == '*')
                    return true;

                break;
            }//end case 'r' and 'R'


            //Knight
            case 'n':
            case 'N':
            {
                var valid = false;

                //Can move 2 up 1 LEFT or RIGHT 
                if (r1 == r - 2 && (c1 == c - 1 || c1 == c + 1))
                    valid = true;

                //Can move 2 right 1 UP or DOWN
                else if (c1 == c + 2 && (r1 == r - 1 || r1 == r + 1))
                    valid = true;

                //Can move 2 down 1 LEFT or RIGHT
                else if (r1 == r + 2 && (c1 == c - 1 || c1 == c + 1))
                    valid = true;

                //Can move 2 left 1 UP or DOWN
                else if (c1 == c - 2 && (r1 == r - 1 || r1 == r + 1))
                    valid = true;

                else
                    return false;
                
                //Validate
                if (valid == true)
                {
                    if (this.board[r1][c1] == '*')
                        return true;

                    else if ((isupper(piece) && islower(this.board[r1][c1])) || 
                             (islower(piece) && isupper(this.board[r1][c1])))
                    {
                        this.captured.push(this.board[r1][c1]);
                        return true;
                    }
                }
                break;
            }//end-case 'n' and 'N'
            

            //Bishop
            case 'b':
            case 'B':
            {
                var validPath = false;
                var i, j;

                //UP-left 
                if (r1 < r && c1 < c)
                {
                    i = r - 1;
                    j = c - 1;

                    //Validate path -- (path must be clear, diagonal)
                    while (validPath == false)
                    {
                        //If traversed past the target
                        if (i < r1 || j < c1)
                            return false;

                        else if (i == r1 && j == c1)
                            validPath = true;

                        //If a square along the path is blocked
                        else if (this.board[i][j] != '*')
                            return false;

                        //Iterate diagonally UP-Left
                        --i;
                        --j;
                    }
                }//end-UpLeft
                //UP-right
                else if (r1 < r && c1 > c)
                {
                    i = r - 1;
                    j = c + 1;

                    //Validate path -- (path must be clear, diagonal)
                    while (validPath == false)
                    {
                        //If traversed past the target
                        if (i < r1 || j > c1)
                            return false;

                        else if (i == r1 && j == c1)
                            validPath = true;

                        //If a square along the path is blocked
                        else if (this.board[i][j] != '*')
                            return false;

                        //Iterate diagonally UP-Right
                        --i;
                        ++j;
                    }
                }//end-UpRight

                //DOWN-left
                else if (r1 > r && c1 < c)
                {
                    i = r + 1;
                    j = c - 1;

                    //Validate path -- (path must be clear, diagonal)
                    while (validPath == false)
                    {
                        //If traversed past the target
                        if (i > r1 || j < c1)
                            return false;

                        else if (i == r1 && j == c1)
                            validPath = true;

                        //If a square along the path is blocked
                        else if (this.board[i][j] != '*')
                            return false;

                        //Iterate diagonally UP-Right
                        ++i;
                        --j;
                    }
                }//end-DownLeft

                //DOWN-right
                else if (r1 > r && c1 > c)
                {
                    i = r + 1;
                    j = c + 1;

                    //Validate path -- (path must be clear, diagonal)
                    while (validPath == false)
                    {
                        //If traversed past the target
                        if (i > r1 || j > c1)
                            return false;

                        else if (i == r1 && j == c1)
                            validPath = true;

                        //If a square along the path is blocked
                        else if (this.board[i][j] != '*')
                            return false;

                        //Iterate diagonally UP-Right
                        ++i;
                        ++j;
                    }
                }//end-DownRight

                //Invalid Direction
                else
                    return false;

                //If path is clear && it's diagonal
                if (validPath == true)
                {
                    //If BLACK is moving
                    if (islower(this.board[r][c]))
                    {
                        //If square is taken by own piece
                        if (this.board[r1][c1] != '*' && islower(this.board[r1][c1]))
                            return false;

                        //If it's a CAPTURE
                        else if (isupper(this.board[r1][c1]))
                            this.captured.push(this.board[r1][c1]);

                        return true;
                    }
                    //If WHITE is moving
                    else
                    {
                        //If square is taken by own piece
                        if (this.board[r1][c1] != '*' && isupper(this.board[r1][c1]))
                            return false;

                        //If it's a CAPTURE
                        else if (islower(this.board[r1][c1]))
                            this.captured.push(this.board[r1][c1]);

                        return true;
                    }
                }//end-ValidPath

                //Can move diagonally UP-right 
                //Can move diagonally DOWN-left or DOWN-right
                break;
            }//end-case 'b' and 'B'


            //King
            case 'k':
            case 'K':
            {
                var validMove = false;

                //Left-Right
                if (r1 == r)
                {
                    if (c1 == c - 1 || c1 ==  c + 1)
                        validMove = true;
                }
                //Up Down
                else if (c1 == c)
                {
                    if (r1 == r - 1 || r1 == r + 1)
                        validMove = true;
                }
                //Diagonal-Once
                else if ((r1 == r + 1 || r1 == r - 1) && 
                         (c1 == c + 1 || c1 == c - 1))
                    validMove = true;

                if (validMove == false)
                    return false;

                //Empty square 
                if (this.board[r1][c1] == '*')
                {
                    this.king_loc[turn1][0] = r1;
                    this.king_loc[turn1][1] = c1;
                    return true;
                }

                //If player's own piece exists there
                if ((islower(piece) && islower(this.board[r1][c1])) ||
                   (isupper(piece) && isupper(this.board[r1][c1])))
                    return false;

                //If enemy's piece exists there
                else if ((isupper(piece) && islower(this.board[r1][c1])) ||
                   (islower(piece) && isupper(this.board[r1][c1])))
                {
                    this.captured.push(this.board[r1][c1]);
                    this.king_loc[turn1][0] = r1;
                    this.king_loc[turn1][1] = c1;
                    return true;
                }

                return false;   

                break;
            }//end-case 'K'


            //Queen
            case 'q':
            case 'Q':
            {
                var validPath = false;
                var i,j;

                //Left -- Right
                if (r1 == r)
                {
                    //Left -- check path
                    if (c1 < c)
                    {
                        for(i = c - 1; i > c1; --i)
                        {
                            if (this.board[i][c1] != '*')
                                return false;
                        }
                    }
                    //Right -- check path
                    else if (c1 > c)
                    {
                        for(i = c + 1; i < c1; ++i)
                        {
                            if (this.board[i][c1] != '*')
                                return false;
                        }
                    }
                    validPath = true;

                }//end-Left--Right

                //Up -- Down
                else if (c1 == c)
                {
                    //Up
                    if (r1 < r)
                    {
                        for (i = r - 1; i > r1; --i)
                        {
                            if (this.board[i][c1] != '*')
                                return false;
                        }
                    }
                    //Down
                    else if (r1 > r)
                    {
                        for (i = r + 1; i < r1; ++i)
                        {
                            if (this.board[i][c1] != '*')
                                return false;
                        }
                    }
                    validPath = true;

                }//end-Up--Down

                //UP-left 
                else if (r1 < r && c1 < c)
                {
                    i = r - 1;
                    j = c - 1;

                    //Validate path -- (path must be clear, diagonal)
                    while (validPath == false)
                    {
                        //If traversed past the target
                        if (i < r1 || j < c1)
                            return false;

                        else if (i == r1 && j == c1)
                            validPath = true;

                        //If a square along the path is blocked
                        else if (this.board[i][j] != '*')
                            return false;

                        //Iterate diagonally UP-Left
                        --i;
                        --j;
                    }
                }//end-UpLeft

                //UP-right
                else if (r1 < r && c1 > c)
                {
                    i = r - 1;
                    j = c + 1;

                    //Validate path -- (path must be clear, diagonal)
                    while (validPath == false)
                    {
                        //If traversed past the target
                        if (i < r1 || j > c1)
                            return false;

                        else if (i == r1 && j == c1)
                            validPath = true;

                        //If a square along the path is blocked
                        else if (this.board[i][j] != '*')
                            return false;

                        //Iterate diagonally UP-Right
                        --i;
                        ++j;
                    }
                }//end-UpRight

                //DOWN-left
                else if (r1 > r && c1 < c)
                {
                    i = r + 1;
                    j = c - 1;

                    //Validate path -- (path must be clear, diagonal)
                    while (validPath == false)
                    {
                        //If traversed past the target
                        if (i > r1 || j < c1)
                            return false;

                        else if (i == r1 && j == c1)
                            validPath = true;

                        //If a square along the path is blocked
                        else if (this.board[i][j] != '*')
                            return false;

                        //Iterate diagonally UP-Right
                        ++i;
                        --j;
                    }
                }//end-DownLeft

                //DOWN-right
                else if (r1 > r && c1 > c)
                {
                    i = r + 1;
                    j = c + 1;

                    //Validate path -- (path must be clear, diagonal)
                    while (validPath == false)
                    {
                        //If traversed past the target
                        if (i > r1 || j > c1)
                            return false;

                        else if (i == r1 && j == c1)
                            validPath = true;

                        //If a square along the path is blocked
                        else if (this.board[i][j] != '*')
                            return false;

                        //Iterate diagonally UP-Right
                        ++i;
                        ++j;
                    }
                }//end-DownRight

                //Anything Else is INVALID
                else
                    return false;
     
                //Validate
                if (validPath && this.board[r1][c1] != '*')
                {
                    if (islower(this.board[r][c]) && isupper(this.board[r1][c1]))
                    {
                        this.captured.push(this.board[r1][c1]);
                        return true;
                    }
                    else if (isupper(this.board[r][c]) && islower(this.board[r1][c1]))
                    {
                        this.captured.push(this.board[r1][c1]);
                        return true;
                    }
                    else
                        return false;
                }
                else if (validPath && this.board[r1][c1] == '*')
                    return true;

                break;
            }//end-case 'q' and 'Q'


            default:
                console.log("Invalid piece");
                return false;
        }//end-Switch

        
    }//end-checkMove


    //IsChecked -- determine if the king is in CHECK
    //***********************************
    this.isChecked = function(turn1)
    {
        var r1 = this.king_loc[turn1][0];
        var c1 = this.king_loc[turn1][1];

        var enemy1 = (turn == 0) ? 1 : 0;


        //For each piece
        for (var i = 0; i < 8; ++i)
        {
            for (var j = 0; j < 8; ++j)
            {
                //If this piece is the enemy's
                if ((turn1 == 1 && islower(this.board[i][j])) || 
                    (turn1 == 0 && isupper(this.board[i][j])))
                {
                    //If this piece can move my king's location
                    if (this.legalMove(enemy1, j, i, c1, r1) == true)
                    {
                        console.log("\tIsChecked Invoked");
                        return true;
                    }
                }
            }
        }

        return false;
    }


    //CheckMate
    //***********************************
    this.checkMate = function(turn1)
    {
        console.log("CheckMate Invoked");
        var r = this.king_loc[turn1][0];
        var c = this.king_loc[turn1][1];

        // A. MOVE OUT -- check for available "safe" squares for the king
        // --------------------------------------
        for (var i = r - 1; i <= r + 1; ++i)
        {
            for (var j = c - 1; j <= c + 1; ++j)
            {
                //Boundary checking
                if (i < 0 || i > 7 || j < 0 || j > 7)
                    continue;
                
                //Skip the king itself
                if (i == r && j == c)
                    continue;

                //  Empty || Enemies
                if ((this.board[i][j] == "*") || 
                    areEnemies(this.board[i][j], this.board[r][c]))
                {
                    console.log("try moving to : " + i.toString() + j.toString());

                    // Save the current state of the board
                    var tempBoard = jQuery.extend(true, {}, this.board);

                    // Place king at this place
                    if (this.checkMove(turn1, c, r, j, i) == true)
                        this.move(turn1, c, r, j, i);
                    else
                        continue;

                    // Check if the king is "safe" here
                    if (this.isChecked(turn1) == false)
                    {
                        console.log("\tsuccess");
                        //Reset board
                        this.board = jQuery.extend(true, {}, tempBoard);

                        //There exists a "safe" square for the king
                        //Thus, !checkMate() 
                        return false;           
                    }
                    // King is not "safe"
                    else
                    {
                        console.log("\tfailed");
                        //Reset board
                        this.board = jQuery.extend(true, {}, tempBoard);
                    }
                }
            }
        }//end-outer-for
        

        // B. JUMP the ATTACKER
        // --------------------------------------

        // C. BLOCK
        // --------------------------------------
        
        return false;
    }//end-checkMate


    //ExposesKing -- if making this move leaves the KING exposed
    //***********************************
    this.exposesKing = function(turn1, c, r, c1, r1)
    {
        //Save state of board
        var tempBoard = jQuery.extend(true, {}, this.board); 

        //Make the move
        this.move(c, r, c1, r1); 

        //Determine if this leaves the king in check/exposed
        if (this.isChecked(turn1) == true)
        {
            console.log("*** King will be exposed ***");
            this.board = jQuery.extend(true, {}, tempBoard);
            return true;
        }
        else
        {
            this.board = jQuery.extend(true, {}, tempBoard);
            return false;
        }
    }



    //Getter -- return value of board[r][c]
    //***********************************
    this.getPiece = function(c,r)
    {
        return this.board[r][c];
    }
}//end-Chess
