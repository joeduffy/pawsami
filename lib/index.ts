import * as aws from "@pulumi/aws";

// getLinuxAmi returns the latest Amazon Linux AMI for the given instance type and region pair (and will differ given
// different pairs). If a region is not given, the currently configured Pulumi AWS region will be used.
// 
// This function dynamically queries Amazon EC2 in order to determine this, and so its answer will change
// from one invocation to the next. This is great for avoiding hard-coding AMI maps in your cloud configuration.
export function getLinuxAmi(instanceType: aws.ec2.InstanceType, region?: aws.Region): Promise<string> {
    // If a default region isn't provided, take the current configured one.
    if (!region) {
        region = aws.config.requireRegion();
    }

    return new Promise<string>((resolve, reject) => {
        let ec2 = new (require("aws-sdk")).EC2({ region: region });
        ec2.describeImages(
            {
                Owners: [ "amazon" ],
                Filters: [{
                    Name: "name",
                    Values: [ "amzn-ami-hvm-????.??.?.x86_64-gp2" ],
                }],
            },
            (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    let newestImage: string | undefined;
                    let newestImageDate: number | undefined;
                    for (let image of data.Images) {
                        let imageDate = Date.parse(image.CreationDate);
                        if (!newestImage || !newestImageDate ||
                                imageDate > newestImageDate) {
                            newestImage = image.ImageId;
                            newestImageDate = imageDate;
                        }
                    }
                    if (newestImage) {
                        resolve(newestImage);
                    } else {
                        reject("No Linux AMI found for the current region");
                    }
                }
            },
        );
    });
}
