var code = `var hiddenRows = [];

const AllRows = () => document.querySelectorAll("table.azc-grid-full tr[role='row'] td[role='gridcell']:first-child div.azc-grid-cellContent");

function HideTableRows(query) {
	AllRows().forEach((e) => {
		if (e.innerText.toLowerCase().indexOf(query.toLowerCase()) == -1)
			e.parentNode.parentNode.style.display = 'none';
		hiddenRows.push(e);
	});
}

function ResetRows() {
	if (hiddenRows.length >= 0) {
		hiddenRows.forEach((e) => {
			e.parentNode.parentNode.style.display = '';
		});
	}
	hiddenRows = [];
}

function Reveal(query) {
	ResetRows()
	HideTableRows(query);
}

function CreateQueryInput() {
	const target = document.querySelector('ul[role="toolbar"]');

	const li = document.createElement('li');
	li.setAttribute("role", "presentation");
	li.setAttribute("class", "azc-toolbar-item azc-toolbarButton fxs-commandBar-item fxs-vivaresize");

	const divInput = document.createElement('div');
	divInput.setAttribute("class", "azc-toolbarButton-container fxs-portal-hover");

	const input = document.createElement("input");
	input.setAttribute("id", "filter");
	input.setAttribute("type", "text");
	input.placeholder = "filter secret"

	divInput.appendChild(input);

	li.appendChild(divInput);

	input.addEventListener('input', (e) => Reveal(e.target.value));
	target.appendChild(li, target);
}

document.addEventListener('readystatechange', e => {
    if (e.target.readyState === "complete" && window.location.href.match(".+(?=\/secrets$).+")) {
		setTimeout( function(){
			CreateQueryInput();
		}, 1000);
	console.log("Injected Azure Key-Vault Filter");
    }
});
`;

function InjectScript(code) {
	var script = document.createElement('script');
	script.textContent = code;
	(document.head || document.documentElement).appendChild(script);
	script.remove();
}

InjectScript(code);
