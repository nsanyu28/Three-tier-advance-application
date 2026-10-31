# AWS 3-Tier Architecture Visualizer

A no-build, no-dependency educational website that explains a production-style AWS three-tier web application. It visualizes the path from customer → DNS / public ALB → private web tier → private application tier → isolated RDS database, plus NAT, security, monitoring and Multi-AZ availability.

> This is an educational reference diagram, not a deployable CloudFormation/Terraform template. Confirm CIDRs, ports, quotas, service behavior and security requirements for your workload.

## What it shows

- One VPC (`10.0.0.0/16`) in `ap-south-1`, with two Availability Zones.
- Public subnets for internet-facing entry and NAT.
- Private web and application subnets.
- Isolated database subnets with Amazon RDS for MySQL Multi-AZ.
- Route 53, Internet Gateway, ALB, NAT Gateway, S3 Gateway Endpoint, IAM, Systems Manager, CloudWatch and SNS.
- Security-group chaining and subnet NACL boundaries.
- Animated customer/API/response/operations packets and interview notes.

## The 12 learning steps

1. AWS Region and VPC — the fenced network.
2. Two Availability Zones — separate failure domains.
3. Subnets — public, private web, private app and isolated database ranges.
4. Internet entry and routing — IGW and route tables.
5. Route 53 and public ALB — DNS and healthy-target routing.
6. Private Web Tier — EC2 and Nginx frontend.
7. Private Application Tier — Node.js / Express API.
8. Isolated Database Tier — RDS MySQL Multi-AZ primary and standby.
9. Complete request/response — follow a customer action end-to-end.
10. NAT and private outbound access — updates and S3 endpoint routing.
11. Security and operations — SG, NACL, IAM and SSM.
12. Monitoring and resilience — CloudWatch, SNS, health checks and failover.

## Moving objects

| Visual | Meaning | Typical path |
|---|---|---|
| ✉ Blue envelope | Customer HTTPS request | Customer → ALB → Web |
| Purple diamond | API request / database query | Web → App → RDS |
| Green packet | Successful response | RDS → App → Web → ALB |
| Yellow packet | Software update / operations event | Private subnet → NAT / monitoring |
| Red marker | Blocked or unauthorized traffic | Stopped by a security boundary |

## Important architecture notes

- A public subnet has a route to an Internet Gateway. An instance generally also needs a public IPv4 address (or another public addressing arrangement) and permissive security controls to be internet reachable.
- Private web and application EC2 instances do not need public IP addresses in this reference design.
- The ALB security group should accept HTTPS from intended clients and allow the web-tier security group to receive its configured backend traffic.
- Web-to-app and app-to-database rules should reference the source tier's security group, not `0.0.0.0/0`.
- Security Groups are stateful. Network ACLs are stateless and operate at subnet boundaries.
- A NAT Gateway allows private resources to initiate outbound connections; it does not allow unsolicited inbound internet connections.
- An S3 Gateway VPC Endpoint can route supported S3 traffic privately without NAT.
- RDS Multi-AZ standby is for high availability/failover. It is not the same as a read replica.
- For stronger AZ resilience, deploy a NAT Gateway in each AZ and route each private subnet to its same-AZ NAT Gateway.
- Use IAM roles and Systems Manager Session Manager for administration rather than opening SSH to the world. Store database secrets in a managed secret store such as Secrets Manager.

## Run locally

No install or build step is required. From the project directory:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> in your browser. (If Python is unavailable, any static HTTP server will work.)

## Publish with GitHub Pages

1. Create a GitHub repository named `aws-3tier-architecture`.
2. Upload the contents of this folder to the repository's `main` branch (the `index.html` file must be at the repository root).
3. Open **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select **main** and **/ (root)**, then click **Save**.
5. Wait for the Pages deployment and open `https://YOUR-USERNAME.github.io/aws-3tier-architecture/`.

## Project structure

```text
aws-3tier-architecture/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
├── README.md
├── LICENSE
└── .nojekyll
```

## Customize text and colors

- Edit the `steps` array near the top of `js/app.js` to change step titles, plain-language descriptions, technical names, watch instructions and interview Q&A.
- Edit `buildDiagram()` in `js/app.js` to move components, change subnet labels or add SVG paths.
- Change CSS variables in `:root` and `:root[data-theme="light"]` in `css/style.css` to customize the page palette.
- SVG classes such as `.public`, `.web`, `.app`, `.db`, `.wire` and `.wire.response` control diagram colors and line styles.
- Change the `speed` selector options or the `5000` millisecond interval in `js/app.js` to adjust animation timing.

## Interview practice prompts

- What makes a subnet public or private?
- Why does the ALB sit in public subnets while the web and app EC2 instances are private?
- How do Security Groups differ from NACLs?
- Why does a private subnet need a NAT Gateway?
- How does RDS Multi-AZ differ from a read replica?
- How would you investigate an unhealthy ALB target?
- Which CloudWatch metrics and alarms would you configure?

## License

MIT. Replace `YOUR NAME` in `LICENSE` before publishing.
