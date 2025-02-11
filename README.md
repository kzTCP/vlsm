# VLSM IP Address Generator

## Overview

This application utilizes **Variable Length Subnet Masking (VLSM)** to generate IPv4 addresses based on user-defined requirements. It allows users to input a network address, a subnet mask, and a list of required host sizes, then calculates the optimal subnet allocations.
([visit](https://kztcp.github.io/vlsm/subnet.html))

## Features

- **VLSM Calculation**: Automatically determines subnet allocations based on required host counts.
- **Subnet Masking**: Supports flexible subnet masks for efficient IP utilization.
- **Tables & Configurations**: Displays subnet details, including network, broadcast addresses, and CIDR notation.
- **OSPF Commands**: Generates necessary OSPF commands for router configurations.
- **Configuration Output**: Provides formatted configurations for ease of implementation.

## How It Works

1. **Input Network Address**: Define the base network (e.g., `172.16.0.0`).
2. **Specify Subnet Mask**: Enter the default subnet mask (e.g., `/16`).
3. **Define Host Requirements**: Input the number of hosts per subnet (e.g., `1000, 50, 2, 2, 2`).
4. **Process Calculation**: Choose to process one or all subnet requirements.
5. **View Results**: Generated subnets are displayed with masks, IP ranges, and network details.
6. **Generate Configuration**: Export OSPF and router configurations for implementation.

## View

![img](https://iili.io/2mKutTJ.png)
