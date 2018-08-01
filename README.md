# Pulumi Amazon Machine Image Helpers

Don't hard-code your AMIs, and don't copy and paste JSON/YAML maps! Use this package instead.

For instance, rather than copy and pasting this into every program you create:

```typescript
import * as aws from "@pulumi/aws";

const instanceTypeToArch: {[instanceType: string]: string} = {
    "t1.micro"    : "PV64" ,
    "t2.nano"     : "HVM64",
    "t2.micro"    : "HVM64",
    "t2.small"    : "HVM64",
    "t2.medium"   : "HVM64",
    "t2.large"    : "HVM64",
    // etc, etc, etc
};

const regionArchToAmi: {[region: string]: {[arch: string]: string}} = {
    "us-east-1"        : {"PV64" : "ami-2a69aa47", "HVM64" : "ami-97785bed", "HVMG2" : "ami-0a6e3770"},
    "us-west-2"        : {"PV64" : "ami-7f77b31f", "HVM64" : "ami-f2d3638a", "HVMG2" : "ami-ee15a196"},
    "us-west-1"        : {"PV64" : "ami-a2490dc2", "HVM64" : "ami-824c4ee2", "HVMG2" : "ami-0da4a46d"},
    "eu-west-1"        : {"PV64" : "ami-4cdd453f", "HVM64" : "ami-d834aba1", "HVMG2" : "ami-af8013d6"},
    "eu-west-2"        : {"PV64" : "NOT_SUPPORTED", "HVM64" : "ami-403e2524", "HVMG2" : "NOT_SUPPORTED"},
    // etc, etc, etc
};

export function getLinuxAmi(region: aws.Region, instanceType: aws.ec2.InstanceType): string {
    let arch = instanceTypeToArch[instanceType];
    let archToAmi = regionArchToAmi[region];
    return archToAmi[arch];
}

let vm = new aws.ec2.Instance("webserver", {
    ami: getLinuxAmi(..., ...),
});
```

and dealing with it being constantly out of date (missing regions, instance types, or outdated AMIs), you can simply
call this library:

```typescript
import * as aws from "@pulumi/aws";
import * as pawsami from "pawsami";

let vm = new aws.ec2.Instance("webserver, {
    ami: pawsami.getLinuxAmi(..., ...),
});
```
