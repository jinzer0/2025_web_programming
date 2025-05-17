// 202211286 김진영

function createTable () {
	let input;
	let num = 0;
	while (!(1 <= num && num <= 10 && !isNaN(num))) {
		input = prompt("1 ~ 10 사이의 숫자를 입력하세요.");
		num = Number.parseInt(input);
	}

	let show_table = document.getElementById("showTable");
	show_table.innerHTML = "";
	show_table.style.display = "flex";
	show_table.style.flexDirection = "row";
	show_table.style.justifyContent = 'center';
	let table = document.createElement("table");
	table.setAttribute("id", "playTable");
	table.style.display = "flex";
	table.style.justifyContent = "center";
	table.style.flexDirection = 'column';
	table.style.borderCollapse = "collapse";

	for (let i = 0; i < num; i++) {
		let tr = document.createElement("tr");

		for (let j = 0; j < num; j++) {
			let td = document.createElement("td");
			td.style.width = "50px";
			td.style.height = "35px";
			td.style.border = "1px solid blue";
			td.style.padding = "0";
			td.style.position = "relative";
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	show_table.appendChild(table);
}

function move() {
	let table = document.getElementById("playTable");
	let tr_list = table.childNodes;
	for (let i = 0; i < tr_list.length; i++) {
		for (let j = 0; j < tr_list.length; j++) {
			if (tr_list[i].childNodes[j].hasChildNodes()) tr_list[i].childNodes[j].firstChild.remove();
		}
	}
	let random_i = Math.floor(Math.random()*tr_list.length);
	let random_j = Math.floor(Math.random()*tr_list.length);

	let target_td = tr_list[random_i].childNodes[random_j];
	let img = document.createElement("img");

	img.src = "img.jpg";
	img.style.maxWidth = "100%";
	img.style.maxHeight ="100%";
	img.style.position = "absolute";
	img.style.top = "50%";
	img.style.left = "50%";
	img.style.transform = "translate(-50%, -50%)";

	target_td.appendChild(img);
}