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
    default_rain_vel = 30;
}

function get_random(min, max) {
    return Math.random() * (max - min) + min;
}

function create_trail(radius, opacity, pos_x, pos_y) {
    let scale = 1;
    let trail_scale_decay = 0.85, trail_min_scale = 0.25;
    let trail_opacity_decay = 0.85;

    const trail = document.createElement('div');
    trail.style.width = radius * 2 + 'px';
    trail.style.height = radius * 2 + 'px';
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

function create_rain(dist_coeff) {
    let radius = default_radius * dist_coeff;
    let opacity = 1;
    let pos_x = get_random(0, window.innerWidth - window.innerHeight / unit_y * unit_x);
    let pos_y = -default_radius;
    let rain_vel = default_rain_vel * dist_coeff;
    // let rain_vel = default_rain_vel;

    const raindrop = document.createElement('div');
    raindrop.style.width = radius * 2 + 'px';
    raindrop.style.height = radius * 2 + 'px';
    raindrop.style.borderRadius = '50%';
    raindrop.style.opacity = opacity.toString();
    raindrop.style.backgroundColor = 'aliceblue';
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

        create_trail(radius, opacity, pos_x, pos_y);

        if(pos_y > window.innerHeight) {
            raindrop.remove();
        } else {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function create_rain_with_random_dist() {
    let dist = get_random(0, 3);
    let scale_coeff = 0.5;
    create_rain(Math.pow(scale_coeff, dist));
}

setInterval(create_rain_with_random_dist, 50);