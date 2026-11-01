export const architecture = {
  region: { name: 'AWS Region', analogy: 'A city where Sanyukta’s business operates', cidr: '10.0.0.0/16' },
  vpc: { name: 'VPC', analogy: 'A fenced private campus', cidr: '10.0.0.0/16' },
  availabilityZones: [
    {
      id: 'az-a',
      name: 'Availability Zone 1a',
      analogy: 'Building A',
      subnets: [
        { name: 'Public Web Subnet', cidr: '10.0.1.0/24', tier: 'web', access: 'internet-facing' },
        { name: 'Private App Subnet', cidr: '10.0.2.0/24', tier: 'app', access: 'no public IPs' },
        { name: 'Private DB Subnet', cidr: '10.0.3.0/24', tier: 'database', access: 'no public IPs' }
      ],
      resources: ['Web EC2', 'App EC2', 'RDS Writer', 'NAT Gateway']
    },
    {
      id: 'az-b',
      name: 'Availability Zone 1b',
      analogy: 'Building B',
      subnets: [
        { name: 'Public Web Subnet', cidr: '10.0.4.0/24', tier: 'web', access: 'internet-facing' },
        { name: 'Private App Subnet', cidr: '10.0.5.0/24', tier: 'app', access: 'no public IPs' },
        { name: 'Private DB Subnet', cidr: '10.0.6.0/24', tier: 'database', access: 'no public IPs' }
      ],
      resources: ['Web EC2', 'App EC2', 'RDS Reader', 'NAT Gateway']
    }
  ],
  services: {
    internetGateway: 'Internet Gateway',
    externalAlb: 'External Application Load Balancer',
    internalAlb: 'Internal Application Load Balancer',
    webAsg: 'Web Auto Scaling Group',
    appAsg: 'App Auto Scaling Group',
    dbSubnetGroup: 'DB Subnet Group',
    s3: 'S3 Bucket',
    iam: 'IAM Role',
    routeTables: 'Route Tables',
    securityGroups: 'Security Groups',
    networkAcls: 'Network ACLs',
    vpn: 'VPN Gateway',
    peering: 'VPC Peering'
  },
  traffic: [
    'Internet', 'Internet Gateway', 'External ALB', 'Web EC2', 'Internal ALB', 'App EC2', 'RDS Writer / Reader', 'Response'
  ]
};

export const glossary = [
  { term: 'AWS Region', definition: 'A geographic area containing multiple isolated Availability Zones.', analogy: 'A city with separate buildings.', role: 'Hosts Sanyukta’s VPC and provides a geographic boundary for the workload.', tags: 'region city geography' },
  { term: 'VPC', definition: 'A logically isolated virtual network that you define in AWS.', analogy: 'A fenced private campus.', role: 'Owns the address space, subnets, routes, and security boundaries.', tags: 'vpc network campus cidr' },
  { term: 'Availability Zone', definition: 'One or more discrete data centers with independent power and networking inside a Region.', analogy: 'A separate building in the same city.', role: 'Spreads the web, app, and database resources for resilience.', tags: 'az zone building resilience' },
  { term: 'Subnet', definition: 'A range of IP addresses inside a VPC, associated with a route table.', analogy: 'A department or section inside a building.', role: 'Separates public web resources from private application and database resources.', tags: 'subnet cidr public private' },
  { term: 'Internet Gateway', definition: 'A horizontally scaled VPC component that enables communication between a VPC and the internet.', analogy: 'The main entrance to the campus.', role: 'Accepts the internet-facing route for the public tier.', tags: 'igw internet gateway entrance' },
  { term: 'Route Table', definition: 'A set of rules that determine where network traffic is directed.', analogy: 'A direction board at every campus junction.', role: 'Sends public traffic to the IGW and private outbound traffic to NAT.', tags: 'route table routing direction' },
  { term: 'Application Load Balancer', definition: 'A Layer 7 load balancer that routes HTTP/HTTPS requests to healthy targets.', analogy: 'A receptionist who picks an available employee.', role: 'The external ALB receives visitors; the internal ALB reaches app servers.', tags: 'alb load balancer traffic http' },
  { term: 'EC2', definition: 'Resizable virtual compute capacity in AWS.', analogy: 'An employee with a workstation.', role: 'Runs Sanyukta’s web and application server processes.', tags: 'ec2 instance compute server' },
  { term: 'Auto Scaling Group', definition: 'A logical group of EC2 instances that maintains desired capacity and replaces unhealthy instances.', analogy: 'Hiring more employees when the queue grows.', role: 'Keeps web and app capacity aligned with demand.', tags: 'asg autoscaling scale capacity' },
  { term: 'RDS Writer', definition: 'The database instance that accepts changes such as inserts, updates, and deletes.', analogy: 'The records clerk allowed to edit the master ledger.', role: 'Handles modifications for the application tier.', tags: 'rds writer database primary sql' },
  { term: 'RDS Reader', definition: 'A read-capable database instance that can serve appropriate read traffic from replicated data.', analogy: 'A records clerk with a synchronized copy for lookups.', role: 'Reduces read pressure on the writer; this visual is not a Multi-AZ standby.', tags: 'rds reader replica read database' },
  { term: 'DB Subnet Group', definition: 'A collection of subnets that an RDS database can use inside a VPC.', analogy: 'The records-room locations reserved for the database.', role: 'Keeps RDS inside private subnets across Availability Zones.', tags: 'db subnet group rds private' },
  { term: 'NAT Gateway', definition: 'A managed network address translation service that lets private resources make outbound connections.', analogy: 'A controlled delivery counter that does not expose private rooms.', role: 'Lets private servers fetch updates through the IGW without public IPs.', tags: 'nat outbound private updates' },
  { term: 'S3', definition: 'An object storage service for files and unstructured data.', analogy: 'A document warehouse.', role: 'Stores assets or documents accessed by the application with an IAM role.', tags: 's3 object storage bucket files' },
  { term: 'IAM Role', definition: 'An identity with permissions that AWS resources can assume without hard-coded credentials.', analogy: 'An employee permission card.', role: 'Grants app servers the least privilege needed to reach S3.', tags: 'iam role permissions security' },
  { term: 'Security Group', definition: 'A stateful virtual firewall attached to resources such as EC2 instances.', analogy: 'An individual door guard.', role: 'Allows only expected ports and sources at each tier.', tags: 'security group sg firewall stateful' },
  { term: 'Network ACL', definition: 'A stateless rule list applied at the subnet boundary.', analogy: 'A floor security checkpoint.', role: 'Adds subnet-level allow/deny controls around public, app, and database sections.', tags: 'nacl network acl stateless subnet' },
  { term: 'VPN', definition: 'An encrypted connection between a network and a VPC over the internet.', analogy: 'A secret tunnel to the campus.', role: 'Connects Sanyukta’s office to private AWS services.', tags: 'vpn tunnel encrypted office' },
  { term: 'VPC Peering', definition: 'A private network connection between two VPCs using private IP addresses.', analogy: 'A private road between campuses.', role: 'Connects a partner VPC without sending traffic over the public internet.', tags: 'peering vpc private partner road' },
  { term: 'Health Check', definition: 'A probe used by a load balancer or scaling system to find healthy targets.', analogy: 'A receptionist checking who is at their desk.', role: 'Keeps requests away from unhealthy web or app instances.', tags: 'health check alb availability' }
];

export function getAllSubnets() {
  return architecture.availabilityZones.flatMap((zone) => zone.subnets.map((subnet) => ({ ...subnet, zone: zone.name })));
}

export function architectureStats() {
  return {
    availabilityZones: architecture.availabilityZones.length,
    subnets: getAllSubnets().length,
    tiers: 3,
    loadBalancers: 2,
    autoScalingGroups: 2,
    writerReader: '1 + 1'
  };
}
