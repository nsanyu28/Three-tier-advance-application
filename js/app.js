'use strict';

const steps = [
 {title:'AWS Region and VPC',short:'Your isolated network',plain:'AWS runs services in geographic Regions. Ravi first gets a fenced plot for his online shop. The VPC is that private network boundary.',why:'A VPC gives you control over IP ranges, routing and network isolation.',technical:'Amazon VPC · 10.0.0.0/16 · ap-south-1',watch:'The large teal boundary appears inside the AWS Region.',q:'What is a VPC?',a:'A logically isolated virtual network in AWS where you launch resources.',show:1},
 {title:'Two Availability Zones',short:'Keep the shop available',plain:'Ravi builds in two separate buildings. If one building has a problem, the other can keep serving customers.',why:'Separating resources across AZs improves fault tolerance and availability.',technical:'Availability Zones · AZ A and AZ B',watch:'Two independent dashed buildings appear inside the VPC.',q:'What is an Availability Zone?',a:'One or more discrete data centers with independent power, networking and connectivity within a Region.',show:2},
 {title:'Subnets for each tier',short:'Separate public and private areas',plain:'Each building has different areas: a public entrance, a web work area, an application work area and a locked records room.',why:'Subnets organize IP addresses and let route tables and security controls differ by tier.',technical:'Public 10.0.1.0/24 & 10.0.2.0/24; Web 10.0.11.0/24 & 10.0.12.0/24; App 10.0.21.0/24 & 10.0.22.0/24; DB 10.0.31.0/24 & 10.0.32.0/24',watch:'Gold, blue, purple and green subnet blocks appear in both AZs.',q:'What makes a subnet public or private?',a:'Its route table: a public subnet has a route to an Internet Gateway; a private subnet does not.',show:3},
 {title:'Internet entry and routing',short:'A controlled front gate',plain:'The Internet Gateway is the society’s main gate. Route tables are signboards telling traffic where it may go. Visitors can reach only the public entry point.',why:'The IGW provides internet connectivity for eligible resources; routes determine the next hop.',technical:'Internet Gateway · public route table · 0.0.0.0/0 → IGW',watch:'The customer request travels to the public edge; private subnet routes stay private.',q:'Does attaching an IGW make every instance public?',a:'No. A public IP, a route to the IGW and permissive security controls are also needed.',show:4},
 {title:'Route 53 and public ALB',short:'DNS and receptionist',plain:'Route 53 is the directory that helps customers find the shop. The public Application Load Balancer is the receptionist who checks which web server is healthy.',why:'DNS maps a domain to the entry point; ALB listeners and target groups route requests to healthy targets.',technical:'Amazon Route 53 · internet-facing Application Load Balancer · HTTPS 443',watch:'The customer packet reaches the ALB, then fans out to healthy web targets.',q:'Why use an ALB?',a:'It distributes application traffic across healthy targets and supports listener rules, TLS termination and health checks.',show:5},
 {title:'Private Web Tier',short:'Serve the frontend',plain:'The web servers are the shop’s front-desk screens. They serve the HTML, CSS and JavaScript, but they are not directly open to the internet.',why:'Private web instances reduce direct exposure. The ALB security group is allowed to reach web servers on HTTP 80.',technical:'EC2 · Nginx · private web subnets · target group',watch:'ALB forwards HTTPS-originated traffic to web servers over the allowed backend port.',q:'Should web EC2 instances have public IPs?',a:'Usually not in this design. The public ALB is the internet-facing entry point.',show:6},
 {title:'Private Application Tier',short:'Run business logic',plain:'When a customer clicks Buy, the web tier sends an API request to application servers. These staff validate the order and apply business rules.',why:'Separating application logic lets teams scale, secure and deploy the API independently from the frontend.',technical:'EC2 · Node.js / Express · internal target group · TCP 4000',watch:'A purple API packet travels from web servers to app servers.',q:'Why separate web and application tiers?',a:'It separates presentation from business logic and allows independent scaling and security boundaries.',show:7},
 {title:'Isolated Database Tier',short:'Store the records safely',plain:'The app servers query the records room. RDS MySQL stores the data. Multi-AZ maintains a standby in another AZ for failover.',why:'The database is not internet reachable and accepts MySQL only from the application security group.',technical:'Amazon RDS for MySQL · Multi-AZ DB subnet group · TCP 3306',watch:'The app tier queries the database; a replication/failover link connects primary and standby.',q:'Is an RDS Multi-AZ standby a read replica?',a:'No. Multi-AZ standby is for high availability and failover; use a read replica when you need read scaling.',show:8},
 {title:'Complete request and response',short:'Follow one customer order',plain:'The request travels down through web and app tiers to the database. The result comes back up the same application path and reaches the customer through the ALB.',why:'Tracing the full round trip helps troubleshoot latency, errors and broken dependencies.',technical:'HTTPS 443 → HTTP 80 → TCP 4000 → MySQL 3306 → response',watch:'Blue and purple packets move inward; green response packets return outward.',q:'Where should database credentials live?',a:'Use a managed secret store such as AWS Secrets Manager and grant access through an IAM role; do not hard-code secrets.',show:9},
 {title:'NAT and private outbound access',short:'Updates go out, visitors stay out',plain:'A NAT Gateway is like a delivery counter. Private instances can initiate outbound connections for updates, but the internet cannot start a new connection to them through NAT.',why:'Private workloads need controlled outbound access for patches and external APIs without public IPs.',technical:'NAT Gateway in public subnet · private default route → NAT · S3 Gateway Endpoint',watch:'A yellow update packet exits from a private tier through its AZ’s NAT Gateway. S3 traffic can use the gateway endpoint.',q:'Does NAT Gateway allow inbound internet connections?',a:'No. It supports outbound connections initiated from private resources and their return traffic.',show:10},
 {title:'Security and operations',short:'Guards, identity and alerts',plain:'Security Groups are door guards on resources; NACLs are gate guards at subnet boundaries. IAM roles give AWS services only the permissions they need. CloudWatch watches the system.',why:'Layered controls limit access, enable secure administration and help detect failures.',technical:'Security Groups (stateful) · NACLs (stateless) · IAM · SSM · CloudWatch · SNS',watch:'Green permitted paths remain; a red untrusted packet is stopped at the web/app boundary.',q:'What is the difference between SG and NACL?',a:'Security Groups are stateful and attached to network interfaces; NACLs are stateless and applied at subnet boundaries.',show:11},
 {title:'Monitoring and resilience',short:'Detect, alert and recover',plain:'CloudWatch is the control-room dashboard. SNS sends alerts. If an AZ or database primary fails, healthy targets and the RDS standby help the shop continue.',why:'Observability and tested recovery processes reduce downtime and shorten incident response.',technical:'CloudWatch metrics/logs/alarms · SNS · ALB health checks · RDS Multi-AZ failover',watch:'Metrics pulse to CloudWatch; an alert is sent and unhealthy targets are marked.',q:'What should you monitor in this architecture?',a:'ALB request count, target health and latency; EC2 CPU and app logs; RDS connections, storage and failover events.',show:12}
];

const $ = id => document.getElementById(id);
const nav = $('stepNav'), svgWires = $('wires'), svgParts = $('components'), svgPackets = $('packets');
let current = 1, timer = null, speed = 1;

function el(tag, attrs={}, parent=svgParts, text='') {
  const n = document.createElementNS('http://www.w3.org/2000/svg',tag);
  Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));
  if(text) n.textContent=text;
  parent.appendChild(n); return n;
}
function rect(x,y,w,h,cls,label,sub='',parent=svgParts) {
  const g=el('g',{},parent); el('rect',{x,y,width:w,height:h,rx:12,class:cls},g);
  if(label) el('text',{x:x+14,y:y+25,class:'component-title'},g,label);
  if(sub) el('text',{x:x+14,y:y+44,class:'small-label'},g,sub);
  return g;
}
function line(d,cls='wire',parent=svgWires) { return el('path',{d,class:cls},parent); }
function label(x,y,t,cls='small-label',parent=svgParts){el('text',{x,y,class:cls},parent,t);}
function packet(x,y,symbol,color='#fff',parent=svgPackets){el('circle',{cx:x,cy:y,r:16,fill:color,opacity:.18},parent);el('text',{x:x-9,y:y+8,class:'packet'},parent,symbol);}
function buildDiagram(){
  svgWires.replaceChildren();svgParts.replaceChildren();svgPackets.replaceChildren();
  // Wires are deliberately drawn before architecture cards.
  line('M115 95 L115 145 L280 145 L280 205','wire');
  line('M280 205 L410 205 L410 300','wire');
  line('M410 300 L410 390','wire');
  line('M410 390 L410 505','wire api');
  line('M410 505 L410 635','wire api');
  line('M410 635 L410 710','wire response');
  line('M410 710 L410 635 L410 505 L410 390','wire response');
  line('M410 390 C600 350 690 350 820 390','wire');
  line('M820 505 L820 635','wire api');
  line('M820 635 C900 710 980 710 1040 635','wire response');
  line('M1040 390 L1160 390 L1160 470','wire optional');
  line('M1040 635 L1160 635 L1160 710','wire optional');
  // Region and VPC boundary
  rect(22,18,1355,810,'component','AWS Region · ap-south-1','Cloud location boundary');
  rect(185,90,900,710,'vpc','VPC · 10.0.0.0/16','Your isolated network');
  // AZs
  rect(215,145,405,620,'zone','Availability Zone A','Independent data-center location');
  rect(650,145,405,620,'zone','Availability Zone B','Separate failure domain');
  // Public subnets
  rect(235,195,365,88,'subnet public','Public subnet A · 10.0.1.0/24');
  rect(670,195,365,88,'subnet public','Public subnet B · 10.0.2.0/24');
  // Tier subnets
  rect(235,300,365,125,'subnet web','Private web · 10.0.11.0/24');
  rect(670,300,365,125,'subnet web','Private web · 10.0.12.0/24');
  rect(235,445,365,125,'subnet app','Private app · 10.0.21.0/24');
  rect(670,445,365,125,'subnet app','Private app · 10.0.22.0/24');
  rect(235,590,365,145,'subnet db','Isolated DB · 10.0.31.0/24');
  rect(670,590,365,145,'subnet db','Isolated DB · 10.0.32.0/24');
  // Core entry and tiers
  rect(28,55,130,70,'component','Customer','Browser · HTTPS');
  rect(250,210,150,55,'component','Public ALB','Listener :443');
  rect(700,210,150,55,'component','NAT Gateway B','Outbound only');
  rect(250,335,145,66,'component','Web EC2 A','Nginx · HTTP 80');
  rect(685,335,145,66,'component','Web EC2 B','Nginx · HTTP 80');
  rect(250,480,145,66,'component','App EC2 A','Node.js · :4000');
  rect(685,480,145,66,'component','App EC2 B','Node.js · :4000');
  rect(250,635,145,72,'component','RDS Primary','MySQL · :3306');
  rect(685,635,145,72,'component','RDS Standby','Multi-AZ standby');
  rect(875,210,165,55,'component','Internet Gateway','Public route');
  rect(875,335,165,66,'component','S3 Gateway Endpoint','Private S3 path');
  rect(875,480,165,66,'component','CloudWatch','Metrics + logs');
  rect(875,635,165,66,'component','SNS Alerts','Email / notification');
  label(1088,100,'TRAFFIC KEY','zone-label');
  label(1088,135,'Blue: customer request');
  label(1088,158,'Purple: API / DB query');
  label(1088,181,'Green: response');
  label(1088,204,'Yellow: ops / updates');
  label(1088,260,'Security boundaries','zone-label');
  rect(1080,280,270,70,'component','Security Groups','ALB → Web → App → DB');
  rect(1080,370,270,70,'component','Network ACLs','Subnet-level stateless rules');
  rect(1080,460,270,70,'component','IAM + SSM','Roles · Session Manager');
  rect(1080,550,270,70,'component','Route tables','Public / private / isolated');
  rect(1080,640,270,70,'component','Route 53','DNS name → ALB');
  label(1088,755,'Conceptual flow; not to scale');
  // Step-based visibility
  [...svgParts.children].forEach((node,i)=>{node.dataset.step = i < 3 ? 1 : i < 5 ? 2 : i < 13 ? 3 : i < 17 ? 4 : i < 19 ? 5 : i < 21 ? 6 : i < 23 ? 7 : i < 25 ? 8 : i < 27 ? 9 : i < 29 ? 10 : 11;});
}
function addPackets(step){
  if(step>=4) packet(115,145,'✉','#55baff');
  if(step>=5){packet(325,290,'●','#55baff');packet(760,290,'●','#55baff');}
  if(step>=7){packet(410,445,'◆','#bd9bff');packet(820,445,'◆','#bd9bff');}
  if(step>=8){packet(410,600,'▤','#51e0b1');packet(820,600,'▤','#51e0b1');}
  if(step>=10) packet(700,190,'⬆','#ffd16a');
  if(step>=11) packet(1045,490,'✓','#51e0b1');
  // SVG animateMotion follows the relevant request/response routes.
  if(step>=5){
    const g=el('text',{class:'packet'},svgPackets,'✉');const anim=el('animateMotion',{dur:`${4/speed}s`,repeatCount:'indefinite',path:'M115 95 L115 145 L280 145 L280 205 L325 205 L325 335'},g);
    anim.beginElement?.();
  }
}
function render(){
  const s=steps[current-1];$('stepCount').textContent=String(current).padStart(2,'0')+' / 12';
  $('stepNumber').textContent=String(current).padStart(2,'0');$('captionTitle').textContent=s.title;
  $('plainText').textContent=s.plain;$('whyText').textContent=s.why;$('technicalText').textContent=s.technical;$('watchText').textContent=s.watch;
  $('interviewQuestion').textContent=s.q;$('interviewAnswer').textContent=s.a;
  [...nav.children].forEach((b,i)=>{b.classList.toggle('active',i===current-1);b.setAttribute('aria-current',i===current-1?'step':'false');});
  [...svgParts.children].forEach(node=>{const show=Number(node.dataset.step||1)<=s.show;node.style.opacity=show?'1':'0';node.style.pointerEvents=show?'auto':'none';if(show&&node.dataset.wasHidden==='1'){node.classList.add('revealed');node.dataset.wasHidden='0';}if(!show)node.dataset.wasHidden='1';});
  addPackets(current);$('prevStep').disabled=current===1;$('nextStep').disabled=current===12;
}
function go(n){current=Math.max(1,Math.min(12,n));buildDiagram();render();}
steps.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='step-button';b.innerHTML=`<span class="step-num">${String(i+1).padStart(2,'0')}</span><span class="step-label"><b>${s.title}</b><small>${s.short}</small></span>`;b.addEventListener('click',()=>{stopAuto();go(i+1);});nav.appendChild(b);});
function stopAuto(){if(timer)clearInterval(timer);timer=null;$('autoPlay').textContent='▶ Auto-play';}
$('autoPlay').addEventListener('click',()=>{if(timer){stopAuto();return;}$('autoPlay').textContent='Ⅱ Pause';timer=setInterval(()=>{if(current===12){stopAuto();return;}go(current+1);},5000);});
$('prevStep').addEventListener('click',()=>{stopAuto();go(current-1);});
$('nextStep').addEventListener('click',()=>{stopAuto();go(current+1);});
$('reset').addEventListener('click',()=>{stopAuto();go(1);});
$('speed').addEventListener('change',e=>{speed=Number(e.target.value);render();});
$('themeToggle').addEventListener('click',()=>{const root=document.documentElement;root.dataset.theme=root.dataset.theme==='light'?'dark':'light';});
buildDiagram();go(1);
