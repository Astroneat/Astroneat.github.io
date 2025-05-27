const game_result = document.getElementById("game_result");
let cols, rows, mine_cnt;

const dx = [-1, -1, 0, 1, 1, 1, 0, -1];
const dy = [0, 1, 1, 1, 0, -1, -1, -1];

let cells = [];
let game_end = false;

function start_game() {
    game_end = false;
    game_result.textContent = "";
    rows = document.getElementById('rows').value;
    cols = document.getElementById('cols').value;
    mine_cnt = document.getElementById('mines').value;
    console.log(rows, cols, mine_cnt);
    init_cells(rows, cols, mine_cnt);
    // debug();
    init_board();
}

function debug() {
    for(let i = 0; i < 9; ++ i) {
        cells[0][i] = make_cell(true, false, false, i);
    }
    cells[1][0] = make_cell(false, true, false, 0);
    cells[1][1] = make_cell(true, false, true, 0);
}

function in_bounds(x, y) {
    return 0 <= x && x < rows && 0 <= y && y < cols;
}


function make_cell(is_opened, is_flagged, is_mine, mine_cnt) {
    let cell = {
        is_opened: is_opened,
        is_flagged: is_flagged,
        is_mine: is_mine,
        mine_cnt: mine_cnt
    }
    return cell;
}

function init_cells(rows, cols, mine_cnt) {
    cells.length = 0;
    for(let r = 0; r < rows; ++ r) {
        let row = [];
        for(let c = 0; c < cols; ++ c) {
            let cell = make_cell(false, false, false, 0);
            row.push(cell);
        }
        cells.push(row);
    }
    console.log(cells);
    
    let pos = [];
    for(let i = 0; i < rows * cols; ++ i) {
        pos.push(i);
    }

    for(let i = pos.length - 1; i >= 0; -- i) {
        const j = Math.floor(Math.random() * (i + 1));
        [pos[i], pos[j]] = [pos[j], pos[i]];
    }

    for(let i = 0; i < mine_cnt; ++ i) {
        const x = parseInt(pos[i] / cols);
        const y = pos[i] % cols;
        console.log(pos[i], x, y);
        cells[x][y].is_mine = true;
        for(let d = 0; d < 8; ++ d) {
            let neighbor_x = x + dx[d];
            let neighbor_y = y + dy[d];
            if(in_bounds(neighbor_x, neighbor_y)) {
                cells[neighbor_x][neighbor_y].mine_cnt += 1;
            }
        }
    }
}

function get_cell_class(cell) {
    let class_name = '';
    if(!cell.is_opened) {
        class_name = 'unopened';
        if(cell.is_flagged)
            class_name = 'flagged';
    }
    else if(cell.is_mine) {
        class_name = 'mine';
    }
    else {
        class_name = "mine_cnt";
    }
    return class_name;
}

function init_board() {
    board.replaceChildren();

    for(let r = 0; r < cells.length; ++ r) {
        let row = document.createElement("tr");
        for(let c = 0; c < cells[0].length; ++ c) {
            let cell = document.createElement('td');
            
            cell.className = get_cell_class(cells[r][c]);
            if(cell.className == 'mine_cnt')
                cell.textContent(cells[r][c].mine_cnt);
            cell.id = r.toString() + "_" + c.toString();
            cell.addEventListener("click", function() { handle_left_click(r, c); });
            cell.addEventListener("contextmenu", function() { handle_right_click(r, c); });
            row.append(cell);
        }
        board.append(row);
    }
}

function handle_left_click(r, c) {
    if(game_end) return;
    if(!cells[r][c].is_opened) {
        open_cell(r, c);
    }
    else if(cells[r][c].is_opened) {
        chord_cell(r, c);
    }

    if(is_victory()) call_victory();
}

function handle_right_click(r, c) {
    if(game_end) return;
    flag_cell(r, c, true);

    if(is_victory()) call_victory();
}

function set_cell_state(r, c, state) {
    cells[r][c] = state;
    cell_disp = document.getElementById(r.toString() + "_" + c.toString());
    cell_disp.className = get_cell_class(state);
    if(cell_disp.className == 'mine_cnt')
        cell_disp.textContent = state.mine_cnt;
}

function open_cell(r, c) {
    if(cells[r][c].is_flagged) return;
    if(cells[r][c].is_opened) return;
    console.log("opened cell: ", r, c);

    set_cell_state(r, c, make_cell(true, cells[r][c].is_flagged, cells[r][c].is_mine, cells[r][c].mine_cnt));
    if(cells[r][c].is_mine) {
        call_defeat();
        return;
    }

    if(cells[r][c].mine_cnt == 0) {
        for(let d = 0; d < 8; ++ d) {
            const nei_x = r + dx[d];
            const nei_y = c + dy[d];
            if(in_bounds(nei_x, nei_y)) {
                open_cell(nei_x, nei_y);
            }
        }
    }
}

function chord_cell(r, c) {
    let nei_unopened = 0;
    let nei_flagged = 0;
    for(let d = 0; d < 8; ++ d) {
        let nei_x = r + dx[d];
        let nei_y = c + dy[d];
        if(in_bounds(nei_x, nei_y)) {
            if(cells[nei_x][nei_y].is_flagged) ++ nei_flagged;
            if(!cells[nei_x][nei_y].is_opened) ++ nei_unopened;
        }
    }

    if(cells[r][c].mine_cnt == nei_flagged) {
        // Open all unflagged mines
        for(let d = 0; d < 8; ++ d) {
            let nei_x = r + dx[d];
            let nei_y = c + dy[d];
            if(in_bounds(nei_x, nei_y)) 
                open_cell(nei_x, nei_y);
        }
    }
    else if(cells[r][c].mine_cnt == nei_unopened) {
        // Flag all neighboring mines
        for(let d = 0; d < 8; ++ d) {
            let nei_x = r + dx[d];
            let nei_y = c + dy[d];
            if(in_bounds(nei_x, nei_y)) 
                flag_cell(nei_x, nei_y, false);
        }
    }
}

function flag_cell(r, c, toggle) {
    if(cells[r][c].is_opened) return;
    console.log("flagged cell: ", r, c);

    if(toggle) 
        set_cell_state(r, c, make_cell(cells[r][c].is_opened, !cells[r][c].is_flagged, cells[r][c].is_mine, cells[r][c].mine_cnt));
    else
        set_cell_state(r, c, make_cell(cells[r][c].is_opened, true, cells[r][c].is_mine, cells[r][c].mine_cnt));
}

function is_victory() {
    let opened = 0, flagged = 0;
    for(let i = 0; i < rows; ++ i) {
        for(let j = 0; j < cols; ++ j) {
            if(cells[i][j].is_opened) ++ opened;
            if(cells[i][j].is_flagged) ++ flagged;
        }
    }
    win_condition = (opened + flagged) == (rows * cols);
    return win_condition;
}

function call_victory() {
    game_end = true;
    game_result.textContent = "You win!";
}

function call_defeat() {
    game_end = true;
    game_result.textContent = "You hit a mine :(";
}
