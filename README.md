# AWS 3-Tier Architecture Visualizer

A polished, framework-free teaching dashboard that helps beginners understand how a resilient AWS three-tier web application fits together. The experience follows Sanyukta's online business from the public internet, through web and application tiers, to a private RDS data tier, with animated packets and plain-language analogies at every stop.

## Features

The site is a single static page built with HTML5, CSS3, vanilla JavaScript, and one inline SVG architecture board. It includes nine progressive lessons, a beginner/technical explanation toggle, autoplay with pause and reset, a complete traffic-flow animation, a failure simulation for AZ 1a, light/dark page themes, a searchable glossary, an architecture summary, responsive mobile navigation, and reduced-motion support.

The architecture board is intentionally kept dark navy while the page shell can switch between a bright paper-like theme and a midnight operations theme. The stage scrolls horizontally on small screens so CIDRs and labels remain readable.

## Architecture

The visualizer models one VPC with CIDR `10.0.0.0/16` across two Availability Zones:

| Location | Public web subnet | Private app subnet | Private DB subnet | Resources |
| --- | --- | --- | --- | --- |
| AZ 1a | `10.0.1.0/24` | `10.0.2.0/24` | `10.0.3.0/24` | Web EC2, App EC2, RDS Writer, NAT Gateway |
| AZ 1b | `10.0.4.0/24` | `10.0.5.0/24` | `10.0.6.0/24` | Web EC2, App EC2, RDS Reader, NAT Gateway |

The logical request path is:

```text
Internet → Internet Gateway → External ALB → Web EC2
→ Internal ALB → App EC2 → RDS Writer / RDS Reader → Response
```

Internet traffic enters through the Internet Gateway and the external Application Load Balancer. The external ALB distributes requests to healthy web servers. Web servers call the internal ALB, which distributes to private application servers. The application tier talks to RDS. The Writer handles modifications, while the Reader handles suitable read traffic. The diagram shows replication between them and explicitly does not label the Reader as a Multi-AZ standby.

Private instances do not have direct public access. When they need software updates, their private route tables send outbound traffic through a NAT Gateway in a public subnet and then through the Internet Gateway. S3 is accessed through an IAM Role rather than hard-coded credentials. Security Groups protect individual resources, while Network ACLs add stateless subnet-level controls.

## The nine learning steps

1. **AWS Region & VPC** — Understand the city and fenced private campus.
2. **Availability Zones** — Add Building A and Building B for resilience.
3. **Subnets** — Separate public web, private app, and private DB departments in each building.
4. **Internet Connectivity** — Trace Internet → IGW → External ALB and public route tables.
5. **Web Tier** — Add Web EC2, health checks, and the Web Auto Scaling Group.
6. **Application & Database Tiers** — Add Internal ALB, App EC2, App Auto Scaling, RDS Writer/Reader, replication, S3, and IAM.
7. **NAT Gateway** — Show private outbound software updates through NAT and the IGW.
8. **Security** — Add Security Groups, Network ACLs, and a blocked intruder packet.
9. **VPN & VPC Peering** — Add Sanyukta's office, an encrypted VPN tunnel, a partner VPC, and private peering.

## Real-world analogies

The visualizer uses Region = city, VPC = fenced campus, Availability Zone = building, Subnet = department, Internet Gateway = main entrance, Route Table = direction board, Load Balancer = receptionist, Web Server = front-desk employee, App Server = back-office employee, Database = records room, NAT Gateway = controlled delivery counter, Security Group = individual door guard, Network ACL = floor security checkpoint, IAM Role = employee permission card, S3 = document warehouse, VPN = encrypted secret tunnel, VPC Peering = private road between campuses, and Auto Scaling = hiring additional employees.

## Folder structure

```text
aws-3tier-visualizer/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── architecture.js
│   ├── animations.js
│   └── steps.js
├── assets/
│   └── favicon.svg
├── manus-routes.json
├── .nojekyll
├── LICENSE
└── README.md
```

`architecture.js` owns canonical network data and glossary entries. `steps.js` owns the nine lesson definitions and explanation copy. `animations.js` owns packet motion and reduced-motion behavior. `app.js` owns state, controls, theme/mode switching, step rendering, autoplay, failure mode, and glossary search. The large SVG remains inline in `index.html` so it is easy to inspect and adapt.

## Run locally

From the project folder:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. Because the project uses ES modules, use a local HTTP server instead of opening `index.html` directly from a `file://` URL.

For the managed preview used during development, the project listens on port 3000:

```bash
python3 -m http.server 3000
```

## Deploy to GitHub Pages

1. Create a repository and upload the complete `aws-3tier-visualizer` folder to the `main` branch.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch → main → / (root) → Save**.

The included `.nojekyll` file keeps the static paths predictable. No build step, npm install, server, database, or paid API is required.

## Customisation

To change the learning story, edit the `steps` array in `js/steps.js`. To change CIDRs, resources, or glossary terms, edit `js/architecture.js` and the matching labels in the inline SVG. To add or restyle components, use the SVG group IDs in `index.html` and the component styles in `css/style.css`. Packet paths are defined by the hidden motion paths near the end of the SVG; each moving packet references one of those paths with `mpath`.

When adding a new step, update the `steps` array and the sidebar is generated automatically. If the new step adds a packet, add a packet group with an `animateMotion` element and include it in `playPacketsForStep` in `js/animations.js`.

## Validation

The delivery checklist covers syntax checks, progressive reveal behavior, autoplay, mode/theme controls, animations, failure simulation, responsive behavior, paths, and architecture accuracy. The project is deliberately dependency-free so the main validation command is:

```bash
for file in js/*.js; do node --check "$file"; done
```

## License

Released under the MIT License. See `LICENSE`.
