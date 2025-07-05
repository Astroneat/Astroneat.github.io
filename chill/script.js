const rain = document.getElementById('rain');
const trail_div = document.getElementById('trail');

let rain_angle, unit_x, unit_y;
let default_radius, default_rain_vel;

function init_variables() {
    rain_angle = get_random(5 * Math.PI / 4, 7 * Math.PI / 4);
    unit_x = -Math.cos(rain_angle);
    unit_y = -Math.sin(rain_angle);
    console.log(rain_angle * 180 / Math.PI, unit_x, unit_y);

    default_radius = 5;
    default_rain_vel = 15;
}

function get_random(min, max) {
    return Math.random() * (max - min) + min;
}

function create_trail(pos_x, pos_y) {
    let scale = 1;
    let opacity = 1;
    let trail_scale_decay = 0.9, trail_min_scale = 0.1;
    let trail_opacity_decay = 1;

    const trail = document.createElement('div');
    trail.style.width = default_radius * 2 + 'px';
    trail.style.height = default_radius * 2 + 'px';
    trail.style.scale = scale + ' ' + scale;
    trail.style.borderRadius = '50%';
    trail.style.backgroundColor = 'aliceblue';
    trail.style.opacity = opacity.toString();
    trail.style.position = 'fixed';
    trail.style.left = pos_x + 'px';
    trail.style.top = pos_y + 'px';

    trail_div.appendChild(trail);

    function animate() {
        scale *= trail_scale_decay;
        opacity *= trail_opacity_decay;
        trail.style.scale = scale + ' ' + scale;
        trail.style.opacity = opacity.toString();

        if(scale < trail_min_scale) {
            trail.remove();
        } else {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function create_rain() {
    let pos_x = get_random(0, window.innerWidth - window.innerHeight / unit_y * unit_x);
    let pos_y = -default_radius;
    // let rain_vel = default_rain_vel + get_random(-5, 5);
    let rain_vel = default_rain_vel;

    const raindrop = document.createElement('div');
    raindrop.style.width = default_radius * 2 + 'px';
    raindrop.style.height = default_radius * 2 + 'px';
    raindrop.style.borderRadius = '50%';
    raindrop.style.backgroundColor = 'aliceblue';
    raindrop.style.opacity = '1';
    raindrop.style.position = 'fixed';
    raindrop.style.transformOrigin = '-100% 50%';
    raindrop.style.left = pos_x + 'px';
    raindrop.style.top = pos_y + 'px';

    rain.appendChild(raindrop);

    function animate() {
        pos_x += unit_x * rain_vel;
        pos_y += unit_y * rain_vel;
        raindrop.style.left = pos_x + 'px';
        raindrop.style.top = pos_y + 'px';

        create_trail(pos_x, pos_y);

        if(pos_y > window.innerHeight) {
            raindrop.remove();
        } else {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

setInterval(create_rain, 100);