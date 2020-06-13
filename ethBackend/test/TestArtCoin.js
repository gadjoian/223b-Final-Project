const ArtCoin = artifacts.require("ArtCoinFactory");
const truffleCost = require('truffle-cost');
//const { result } = require('truffle-cost');
const {performance} = require('perf_hooks');

contract("ArtCoinFactory", accounts => {
    it("should put 0 ArtCoin in the first account", () =>
        ArtCoin.deployed()
            .then(instance => instance.balanceOf(accounts[0]))
            .then(balance => {
                assert.equal(
                    balance.valueOf(),
                    0,
                    "0 wasn't in the first account"
                );
            }));

            
    // it("should create coins correctly from the owner", () => {

    //     // Get initial balances of first and second account.
    //     const account_one = accounts[0];
    //     const account_two = accounts[1];

    //     var account_one_starting_balance;
    //     var account_two_starting_balance;
    //     var account_one_ending_balance;
    //     var account_two_ending_balance;

    //     const amount = 1;

    //     return ArtCoin.deployed()
    //         .then(instance => {
    //             artBank = instance;
    //             artBank.createArtCoin("Mona Lisa", "Leonardo Da Vinci", account_one, { from: accounts[0] });
    //             artBank.createArtCoin("Turbo Lisa", "Garo Adjoian", account_two, { from: accounts[0] });
    //             return artBank.balanceOf(account_one);
    //         })
    //         .then(balance => {
    //             account_one_starting_balance = balance;
    //             return artBank.balanceOf(account_two);
    //         })
    //         .then(balance => {
    //             account_two_starting_balance = balance;
    //             return artBank.allCoinsOfOwner(account_one);
    //         })
    //         .then(coins => {
    //             return artBank.transferFrom(account_one, account_two, coins[0], { from: accounts[0] });
    //         })
    //         .then(() => artBank.balanceOf(account_one))
    //         .then(balance => {
    //             account_one_ending_balance = balance;
    //             return artBank.balanceOf(account_two);
    //         })
    //         .then(balance => {
    //             account_two_ending_balance = balance;

    //             assert.equal(
    //                 account_one_ending_balance,
    //                 parseInt(account_one_starting_balance, 10) - amount,
    //                 "Amount wasn't correctly taken from the sender"
    //             );
    //             assert.equal(
    //                 account_two_ending_balance,
    //                 parseInt(account_two_starting_balance, 10) + amount,
    //                 "Amount wasn't correctly sent to the receiver"
    //             );
    //             return artBank.getPendingArt();
    //         })
    //         .then(pendingArt => {
    //             pendingArtCount = pendingArt.reduce(function (x, y) { return y == 0 ? x - 1 : x; }, pendingArt.length);
    //             assert.equal(
    //                 pendingArtCount,
    //                 0,
    //                 "Pending art count is not 0"
    //             )
    //         });
    // });
    // it("should be able to request creation of artcoin", () => {

    //     const owner = accounts[0];
    //     const non_owner = accounts[1];

    //     return ArtCoin.deployed()
    //         .then(instance => {
    //             artBank = instance;
    //             artBank.requestCreate("Garbro Lisa", "Turbo", non_owner, { from: non_owner });
    //             return artBank.getPendingArt();
    //         })
    //         .then(pendingArt => {
    //             pendingArtCount = pendingArt.reduce(function (x, y) { return y == 0 ? x - 1 : x; }, pendingArt.length);
    //             assert.equal(
    //                 pendingArtCount,
    //                 1,
    //                 "Pending art count is not equal to 1"
    //             );
    //         })
    // });
    // it("owner should be able to approve create request", () => {

    //     const owner = accounts[0];
    //     const non_owner = accounts[1];

    //     return ArtCoin.deployed()
    //         .then(instance => {
    //             artBank = instance;
    //             return artBank.getPendingArt();
    //         })
    //         .then(pendingArt => {
    //             // assert.fail(artBank.requestApprove(pendingArt[0], {from: non_owner}))
    //             artBank.requestApprove(pendingArt[0], { from: owner })
    //             return artBank.getPendingArt()
    //         })
    //         .then((pendingArt) => {
    //             pendingArtCount = pendingArt.reduce(function (x, y) { return y == 0 ? x - 1 : x; }, pendingArt.length);
    //             assert.equal(
    //                 pendingArtCount,
    //                 0,
    //                 "Pending art count did not decrease to 0"
    //             );
    //         })
    // });
    // it("art transfer should only happen once", () => {

    //     const requester1 = accounts[2];
    //     const requester2 = accounts[3];
    //     const artOwner = accounts[1];

    //     return ArtCoin.deployed()
    //         .then(instance => {
    //             artBank = instance;
    //             return artBank.allCoinsOfOwner(artOwner);
    //         })
    //         .then((artList) => {
    //             artOwnerStartingBalance = artList.length;
    //             artBank.requestTransfer(artList[0], requester1);
    //             artBank.requestTransfer(artList[0], requester2);
    //             return artBank.getArtToRequester(artOwner);
    //         })
    //         .then(artToRequester => {
    //             artId = artToRequester[0];
    //             requesters = artToRequester[1];
    //             async function asyncfor() {
    //                 for (let i = 0; i < artId.length; i++) {
    //                     await artBank.safeTransferFrom(artOwner, requesters[i], artId[i], { from: artOwner })
    //                 }
    //             }
    //             //return artBank.allCoinsOfOwner(artOwner)
    //         })/*
    //     .then((allcoins) => {
    //         assert.equal(
    //             allcoins.length,
    //             artOwnerStartingBalance - 1,
    //             "Art has not been transferred"
    //         );
    //         return artBank.allCoinsOfOwner(requester1), artBank.allCoinsOfOwner(requester2)
    //     })
    //     .then(count1, count2 => {
    //         assert.equal(
    //             count1 + count2, 
    //             1,
    //             "Art coin only transferred to both requesters"
    //         );*/
    //     //})
    // });

    it("gas cost of creating first art coin", () => {

        // Get initial balances of first and second account.
        const account_one = accounts[0];
        const account_two = accounts[1];
        var gasPrice;

        let createSum = 0;
        let transferSum = 0;
        let requestTransferSum = 0;
        let requestApproveSum = 0;
        let requestCreateSum = 0;
        return ArtCoin.deployed()
            .then(async (artCoinContract) => {
                await web3.eth.getGasPrice(function(error, result){
                    console.log(result);
                    gasprice = result
                });

                for (let i = 0; i <  100; i++) {
                    if (i % 10 === 0) {
                        let result = await truffleCost.log(
                            artCoinContract.createArtCoin("Mona Lisa", "Leonardo Da Vinci", account_one, { from: accounts[0] }), 'USD')
                        createSum += result.receipt.gasUsed
                        console.log("create cost: " + result.receipt.gasUsed)
                        
                        artCoinContract.allCoinsOfOwner(account_one).then(async coins => {
                            result = await truffleCost.log(
                                artCoinContract.safeTransferFrom(account_one, account_two, coins[0], { from: accounts[0] }), 'USD')
                            transferSum += result.receipt.gasUsed
                            console.log("transfer cost: " + result.receipt.gasUsed)

                            result = await truffleCost.log(
                                artCoinContract.requestTransfer(coins[0], accounts[1], { from: accounts[0] }), 'USD')
                            requestTransferSum += result.receipt.gasUsed
                            console.log("request transtfer cost: " + result.receipt.gasUsed)
                        })

                        i++;

                        result = await truffleCost.log(
                            artCoinContract.requestCreate("Mona Lisa", "Leonardo Da Vinci", accounts[1], { from: accounts[0] }), 'USD'
                        )
                        
                        requestCreateSum += result.receipt.gasUsed
                        console.log("request create cost: " + result.receipt.gasUsed)
                        
                        result = await truffleCost.log(
                            artCoinContract.requestApprove(0, { from: accounts[0] }), 'USD'
                        )
                        
                        requestApproveSum += result.receipt.gasUsed
                        console.log("request approve cost: " + result.receipt.gasUsed)
                        
                        var a = performance.now();
                        artCoinContract.getPendingArt();
                        var b = performance.now();
                        console.log('getPendingArt took ' + (b - a) + ' ms.');

                        var a = performance.now();
                        artCoinContract.getApprovedArt();
                        var b = performance.now();
                        console.log('getApprovedArt took ' + (b - a) + ' ms.');

                        var a = performance.now();
                        artCoinContract.allCoinsOfOwner(accounts[0]);
                        var b = performance.now();
                        console.log('allCoinsOfOwner took ' + (b - a) + ' ms.');
                        
                    } else {
                        artCoinContract.createArtCoin("Mona Lisa", "Leonardo Da Vinci", account_one, { from: accounts[0] })
                    }
                }
                console.log("average creating art: " + (createSum / 10))
                console.log("average transfering art: " + (transferSum / 10))
                console.log("average requesting art transfer: " + (requestTransferSum/ 10))
                console.log("average requesting art creation: " + (requestCreateSum / 10))
                console.log("average approving art creation: " + (requestApproveSum / 10))
            });
    });
    
});
    // it("gas cost of creating 100th art coin", () => {

    //     // Get initial balances of first and second account.
    //     const account_one = accounts[0];

    //     return ArtCoin.deployed()
    //         .then(async (artCoinContract) => {
    //             for (let i = 0; i < 5; i++) {
    //                 artCoinContract.createArtCoin("Mona Lisa", "Leonardo Da Vinci", account_one, { from: accounts[0] });
    //             }

    //             balance = artCoinContract.balanceOf(account_one);
    //             assert(balance, 5, "Balance should be 5 after creating 5 coins");

    //             await truffleCost.log(
    //                 artCoinContract.createArtCoin("Mona Lisa", "Leonardo Da Vinci", account_one, { from: accounts[0] }), 'USD'
    //             );
    //         })
    // });

    // it("gas cost of transfering one art coin", () => {

    //     // Get initial balances of first and second account.
    //     const account_one = accounts[0];
    //     const account_two = accounts[1];

    //     let sum = 0;
    //     return ArtCoin.deployed()
    //         .then(async (artCoinContract) => {
    //             for (let i = 0; i < 1000; i++) {
    //                 await artCoinContract.createArtCoin("Mona Lisa", "Leonardo Da Vinci", account_one, { from: accounts[0] })
    //                 if (i % 500 === 0 && i !== 0) {
    //                     artCoinContract.allCoinsOfOwner(account_one).then(async coins => {
    //                         let result = await truffleCost.log(
    //                             artCoinContract.safeTransferFrom(account_one, account_two, coins[0], { from: accounts[0] }), 'USD')
    //                         sum += result.receipt.gasUsed
    //                     })
    //                     // console.info(i, sum / 2)
    //                 }
    //             }
    //             console.log("average: " + (sum / 4))
    //         });
            /*
        return ArtCoin.deployed()
            .then(instance => {
                artCoinContract = instance
                artCoinContract.createArtCoin("Mona Lisa", "Leonardo Da Vinci", account_one, { from: accounts[0] })
                balance_one = artCoinContract.balanceOf(account_one);
                assert(balance, 1, "Balance should be one after creating first art coin");

                return artBank.allCoinsOfOwner(account_one)
            })
            .then(async coins => {
                result = await truffleCost.log(
                    artCoinContract.safeTransferFrom(account_one, account_two, coins[0], { from: accounts[0] }), 'USD')
            })/*
    });

    it("gas cost of requesting transfer of one art coin", () => {
        const account_one = accounts[0];
        return ArtCoin.deployed()
            .then(instance => {
                artCoinContract = instance
                artCoinContract.createArtCoin("Mona Lisa", "Leonardo Da Vinci", account_one, { from: accounts[0] })
                balance_one = artCoinContract.balanceOf(account_one);
                return artBank.allCoinsOfOwner(account_one)
            })
            .then(async coins => {
                result = await truffleCost.log(
                    artCoinContract.requestTransfer(coins[0], accounts[1], { from: accounts[0] }), 'USD')
            });
    });

    it("gas cost of requesting creation of one art coin", () => {

        return ArtCoin.deployed()
            .then(async artCoinContract => {
                result = await truffleCost.log(
                    artCoinContract.requestCreate("Mona Lisa", "Leonardo Da Vinci", accounts[1], { from: accounts[0] }), 'USD')
            });
    });

    it("gas cost of approving creation of one art coin", () => {

        return ArtCoin.deployed()
            .then(async artCoinContract => {
                artCoinContract.requestCreate("Mona Lisa", "Leonardo Da Vinci", accounts[1], { from: accounts[0] })
                result = await truffleCost.log(
                    artCoinContract.requestApprove(0, { from: accounts[0] }), 'USD')
            });
    });

    it("time reading", () => {

        return ArtCoin.deployed()
            .then(async artCoinContract => {
                var a = performance.now();
                artCoinContract.getPendingArt();
                var b = performance.now();
                console.log('It took ' + (b - a) + ' ms.');
            });
    });/*
});
*/