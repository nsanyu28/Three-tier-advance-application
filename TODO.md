# Delivery checklist

- [x] The page explains Sanyukta's AWS story with simple analogies and provides Beginner/Technical modes.
- [x] The diagram uses one inline SVG with `viewBox="0 0 1400 850"`, dark navy gradient, dot grid, clear Region/VPC/AZ/subnet boundaries, readable labels, and responsive horizontal scrolling.
- [x] The architecture includes VPC `10.0.0.0/16`; AZ 1a and AZ 1b; six exact public/private subnet CIDRs; Internet Gateway; route tables; external/internal ALBs; Web/App Auto Scaling Groups; Web/App EC2 instances; RDS Writer/Reader; DB subnet group; S3; IAM role; two NAT gateways; Security Groups; and Network ACLs.
- [x] The logical traffic path is Internet → IGW → External ALB → Web Server → Internal ALB → App Server → RDS → response, with private tiers remaining private and outbound access using NAT.
- [x] The nine learning steps progressively reveal the architecture and earlier steps restore prior state.
- [x] Customer, data, replication, update, intruder, VPN, and peering packets use dedicated SVG motion paths; reduced-motion users receive static directional cues.
- [x] Autoplay advances every 5 seconds, Pause stops it, Reset returns to step 1, and progress is visible.
- [x] The explanation card updates with step title, plain words, technical explanation, and watch-the-picture guidance.
- [x] Traffic Flow animates the complete journey; Failure Simulation dims AZ 1a, shows blocked resources, and explains healthy AZ 1b continuation without claiming universal failover.
- [x] Architecture Summary reports 2 AZs, 6 subnets, 3 application tiers, 2 load balancers, 2 auto scaling groups, and 1 writer + 1 reader database.
- [x] Searchable glossary provides definition, analogy, and role for all major technical terms.
- [x] Light/dark page themes preserve the dark diagram; keyboard focus, labels, and responsive layouts are included.
- [x] README covers features, architecture, steps, analogies, traffic flow, Writer/Reader, security/high availability, structure, local execution, GitHub Pages, customization, and MIT License.
- [x] `node --check` passes for every JavaScript file, the static server responds on port 3000, and `aws-3tier-visualizer.zip` contains the complete project folder.
