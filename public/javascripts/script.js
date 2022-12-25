
        function composeMailBox() {
            document.querySelector(".close").addEventListener("click", function () {
                document.querySelector(".composeMail").style.display = "none";
            });
            document.querySelector(".compose").addEventListener("click", function () {
                document.querySelector(".composeMail").style.display = "initial";
            })
        }

        function dark() {
            var flag = 0;
            document.querySelectorAll(".both").forEach(function (elem) {

                elem.addEventListener("click", function (dets) {
                    if (flag === 0) {
                        document.querySelector("#moon").style.transform = "rotate(360deg)";
                        document.querySelector("#moon").style.opacity = "0";
                        document.querySelector("#sun").style.transform = "translate(-50%, -50%) rotate(360deg)";
                        document.querySelector("#sun").style.opacity = "1";


                        flag = 1;
                    } else {
                        document.querySelector("#moon").style.transform = "rotate(0deg)";
                        document.querySelector("#moon").style.opacity = "1";
                        document.querySelector("#sun").style.transform = "translate(-50%, -50%) rotate(0deg)";
                        document.querySelector("#sun").style.opacity = "0";

                        flag = 0;
                    }
                })
            })
        }

        function imageChange() {
            document.querySelector(".account img").addEventListener("click", function () {
                document.querySelector("#choosepic").click();
            });
            document.querySelector("#choosepic").addEventListener("change", function () {
                document.querySelector("#set").click();
            });
        }

        function menuResponsive() {
            let close = true;
            document.querySelector('.close-mlp').addEventListener('click', () => {
                if (close) {
                    document.querySelector('#left-pannel').style.transform = "translate(0%)";
                    document.querySelector('.close-mlp i').style.transform = "rotate(0deg)";
                    close = false;
                } else {
                    document.querySelector('#left-pannel').style.transform = "translate(-100%)";
                    document.querySelector('.close-mlp i').style.transform = "rotate(180deg)";
                    close = true;
                }
            })
        }

        document.querySelectorAll(".pannels").forEach(function (elems) {
            elems.addEventListener("click", function (dets) {
                // dets.target.children[1].click();
                console.log();
                axios.get(`${dets.target.children[1].attributes.href.value}`)
                .then((response) =>{
                    console.log(response.data.sentMails);
                });
                
            })
        });

        dark();
        composeMailBox();
        imageChange();
        menuResponsive();

