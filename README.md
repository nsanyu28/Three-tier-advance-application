Deploy a Three-Tier Web Application on AWS
Created by Sanyukta Nirmal

A step-by-step guide for deploying a highly available, secure, scalable, and fault-tolerant three-tier web application on AWS.

Overview
This project separates the application into three layers:

•Web/presentation tier: Public-facing web servers running Nginx.
•Application tier: Private application servers running the backend logic.
•Database tier: A private Amazon RDS/Aurora database for persistent data.

The architecture uses two Availability Zones to improve availability and fault tolerance.

Architecture
Users
  |
  v
External Application Load Balancer
  |
  v
Web Tier: Nginx servers in public subnets
  |
  v
Internal Application Load Balancer
  |
  v
Application Tier: Node.js servers in private subnets
  |
  v
Database Tier: Amazon RDS/Aurora in private subnets

The application source code is stored in Amazon S3 and deployed to the application servers. Auto Scaling groups maintain the required number of healthy web and application instances.

AWS Services Used
•Amazon VPC
•Public and private subnets
•Internet Gateway
•NAT Gateways
•Route Tables
•Security Groups
•Amazon EC2
•Amazon Machine Images (AMIs)
•Launch Templates
•Auto Scaling Groups
•Application Load Balancers
•Amazon RDS/Aurora
•Amazon S3
•AWS IAM

Network Layout
Subnet	Availability Zone	Type	CIDR block
Web-Tier-Subnet-1-Public	1a	Public	10.0.1.0/24
App-Tier-Subnet-1-Private	1a	Private	10.0.2.0/24
DB-Tier-Subnet-1-Private	1a	Private	10.0.3.0/24
Web-Tier-Subnet-2-Public	1b	Public	10.0.4.0/24
App-Tier-Subnet-2-Private	1b	Private	10.0.5.0/24
DB-Tier-Subnet-2-Private	1b	Private	10.0.6.0/24
The VPC uses the CIDR block 10.0.0.0/16.

Deployment Steps
1Create the VPC and six subnets.
2Create the Internet Gateway, NAT Gateways, and route tables.
3Create security groups for the web, application, and database tiers.
4Create the database subnet group and RDS/Aurora database.
5Create the required IAM role.
6Create an S3 bucket and upload the application source code.
7Create and configure the test application server.
8Create an AMI of the application server.
9Create the application target group, launch template, and internal load balancer.
10Create and configure the test web server.
11Create an AMI of the web server.
12Create the web target group, launch template, and external load balancer.
13Create Auto Scaling groups for the web and application tiers.
14Access and test the application.
15Delete the AWS resources when finished to avoid unnecessary charges.

For the full click-by-click instructions, see Three-Tier-AWS-Project-Sanyukta-Nirmal.pdf.

Source Code
The application source code is available at:

https://github.com/nsanyu28/3Tier-Application

Important Cost Warning
NAT Gateways, load balancers, EC2 instances, and RDS/Aurora can incur AWS charges. If this is a learning project, complete the cleanup step and delete unused resources after testing.

Prerequisites
•An AWS account
•Basic familiarity with the AWS Management Console
•An AWS Region selected for all resources, such as ap-south-1
•The application source code
•Permission to create VPC, EC2, S3, IAM, load-balancing, Auto Scaling, and RDS resources

Author
Sanyukta Nirmal
