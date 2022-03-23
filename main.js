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
	const li = document.createElement('li');
	li.setAttribute("role", "presentation");
	li.setAttribute("class", "azc-toolbar-item azc-toolbarButton fxs-commandBar-item fxs-vivaresize");
	li.setAttribute("id", "input-filter");
	const divInput = document.createElement('div');
	divInput.setAttribute("class", "azc-toolbarButton-container fxs-portal-hover");

	const input = document.createElement("input");
	input.setAttribute("id", "filter");
	input.setAttribute("type", "text");
	input.placeholder = "filter secret"

	divInput.appendChild(input);

	li.appendChild(divInput);

	input.addEventListener('input', (e) => Reveal(e.target.value));
	return li;
}

function AddLoadMoreEventListener()
{
	var target = document.querySelector("div.azc-grid-footer a[role='button']");
	var input = document.querySelector("input[id='filter']");
	target.addEventListener("click", function(){
		var interval = setInterval(function() {
			if(!jQuery.Active) 
				Reveal(input.value);
			else
				clearInterval(interval);
		}, 100);
	});
}

function InjectFilter()
{

	const target = document.querySelector('ul[role="toolbar"]');
	const filterInput = CreateQueryInput();
	target.appendChild(filterInput, target);
	AddLoadMoreEventListener();
}
function EmptyInputFilter()
{
	document.querySelector("li[id='input-filter'] input").value = ""
}

setTimeout(function(){
	InjectFilter();

	let lastUrl = location.href; 
	new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		{
			if(!document.querySelector("li[id='input-filter']"))
			{
				if(location.href.match(".+(?=\/secrets$).+"))
				{
					InjectFilter();
				}
			}
			else
			{
				EmptyInputFilter();
				ResetRows();
			}
		}
	}
	}).observe(document, {subtree: true, childList: true});
}, 1000);
`;

function InjectScript(code) {
	var script = document.createElement('script');
	script.textContent = code;
	(document.head || document.documentElement).appendChild(script);
	script.remove();
}

document.addEventListener('readystatechange', event => { 
    if (event.target.readyState === "complete") {
		InjectScript(code);
		console.log("Injected Azure Key-Vault Filter");
    }
});
