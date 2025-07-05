const game_result = document.getElementById("game_result");
const mine_counter = document.getElementById("mine_counter");
const timer = document.getElementById("timer");
const difficulty = document.getElementById("difficulty");
let cols, rows, mine_cnt;
let start_time;
let time_interval;
let leniency;

const dx = [-1, -1, 0, 1, 1, 1, 0, -1];
const dy = [0, 1, 1, 1, 0, -1, -1, -1];

let cells = [];
let mine_pos = [];
let game_end = false;
let first_click = false;

function counting_time() {
    let now = new Date().getTime();
    let distance = now - start_time;
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if(seconds < 10) seconds = "0" + seconds;
    timer.textContent = minutes + ":" + seconds;
}

function start_counting_time() {
    start_time = new Date().getTime();
    time_interval = setInterval(function() {
        counting_time();
        if(game_end)
            clearInterval(time_interval);
    })
}

function start_game() {
    first_click = false;
    game_end = false;
    game_result.textContent = "";
    timer.textContent = "0:00";
    clearInterval(time_interval);

    let diff = difficulty.value;
    if(diff == "beginner") {
        rows = 9;
        cols = 9;
        mine_cnt = 10;
    }
    else if(diff == "intermediate") {
        rows = 16;
        cols = 16;
        mine_cnt = 40;
    }
    else if(diff == "expert") {
        rows = 16;
        cols = 30;
        mine_cnt = 99;
    }

    mine_counter.textContent = mine_cnt;
    console.log(rows, cols, mine_cnt);
    init_cells(rows, cols, mine_cnt);
    init_board();
    // debug();
}

function debug() {
    console.log(get_cell_class(make_cell(false, false, false, 100)));
    set_cell_state(0, 0, make_cell(false, false, false, 100));
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

    mine_pos.length = 0;
    for(let spawned_mine = 0; spawned_mine < mine_cnt; ) {
        while(true) {
            const x = Math.floor(Math.random() * rows);
            const y = Math.floor(Math.random() * cols);
            const pos = x + "_" + y;
            if(!mine_pos.includes(pos)) {
                mine_pos.push(pos);
                cells[x][y].is_mine = true;
                cells[x][y].mine_cnt = 0;
                // cells[x][y].is_opened = true;
                for(let d = 0; d < 8; ++ d) {
                    const nei_x = x + dx[d];
                    const nei_y = y + dy[d];
                    if(in_bounds(nei_x, nei_y) && !cells[nei_x][nei_y].is_mine) {
                        cells[nei_x][nei_y].mine_cnt += 1;
                        console.log(nei_x, nei_y, cells[nei_x][nei_x].mine_cnt);
                    }
                } 
                ++ spawned_mine;
                break;
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
    if(!first_click) {
        start_counting_time();
    }
    first_click = true;

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
    if(cell_disp.className == 'mine_cnt' && state.mine_cnt > 0)
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

    const prev_state = cells[r][c].is_flagged;
    if(toggle) {
        set_cell_state(r, c, make_cell(cells[r][c].is_opened, !cells[r][c].is_flagged, cells[r][c].is_mine, cells[r][c].mine_cnt));
    }
    else {
        set_cell_state(r, c, make_cell(cells[r][c].is_opened, true, cells[r][c].is_mine, cells[r][c].mine_cnt));
    }
    const cur_state = cells[r][c].is_flagged;
    if(prev_state != cur_state) {
        if(!cur_state) mine_counter.textContent -= -1;
        else mine_counter.textContent -= 1;
    }
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

    // reveal all mines
    for(let i = 0; i < mine_pos.length; ++ i) {
        // const x = mine_pos[i][0], y = mine_pos[i][1];
        const pos = mine_pos[i].split("_");
        const x = pos[0], y = pos[1];
        set_cell_state(x, y, make_cell(true, false, true, 0));
    }
}

function show_hint() {
    alert("i havent coded this part yet");
}
    