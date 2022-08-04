
const getData = localStorage.getItem("dbCandidato");

let candidatos;

if (getData){
  candidatos = JSON.parse(getData);
} else {
  candidatos = [
    { id: "1", cpf: "426.046.108-76", nome: "Lucas Vieira Dias", celular: "11957770782", email: "lvdias98@gmail.com", sexo: "Masculino", nascimento: "01/12/1998", skills: { html: true, css: true, js: true } },
    { id: "2", cpf: "426.046.108-76", nome: "Nelson Santana", celular: "11957770782", email: "nelson@gmail.com", sexo: "Masculino", nascimento: "01/12/1998", skills: { html: true, css: true, js: true } },
  ];
}

//função para mascara telefne
var SPMaskBehavior = function (val) {
	return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
},
spOptions = {
	onKeyPress: function(val, e, field, options) {
		field.mask(SPMaskBehavior.apply({}, arguments), options);
	}
};

// mascara telefne
$('#celular').mask(SPMaskBehavior, spOptions);

// funcao validar cpf
function TestaCPF(strCPF) {
  strCPF = strCPF.replace(".", "").replace(".", "").replace("-", "");
  var Soma;
  var Resto;
  Soma = 0;
if (strCPF == "00000000000") return false;

for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
  return true;
}



function abrirModal(candidato) {

  if (candidato) {
    document.getElementById("id").value = candidato.id;
    document.getElementById("cpf").value = candidato.cpf;
    document.getElementById("nome").value = candidato.nome;
    document.getElementById("celular").value = candidato.celular;
    document.getElementById("email").value = candidato.email;
    if(candidato.sexo=='Masculino'){
      document.getElementById("sexoMasculino").checked = true;
    }else{
      document.getElementById("sexoFeminino").checked = true;
    }
    document.getElementById("nascimento").value = candidato.nascimento.split('/').reverse().join('-');
    document.getElementById("skillHtml").checked = candidato.skills.html;
    document.getElementById("skillCss").checked = candidato.skills.css;
    document.getElementById("skillJs").checked = candidato.skills.js;
  }

  $('#candidatoModal').modal('show');
}

function fecharModal() {
  $('#candidatoModal').modal('hide');
  $('body').removeClass('modal-open');
  $('body').removeAttr('style');
  $('.modal-backdrop').remove();

  $(".form-input").each(function() {
    $(this).removeClass("is-invalid");	
  });
    
  $("[name='skills']").removeClass("is-invalid");	  

  document.getElementById("id").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("celular").value = "";
  document.getElementById("email").value = "";
  document.getElementById("sexoMasculino").checked = true;
  document.getElementById("nascimento").value = '';
  document.getElementById("skillHtml").checked = false;
  document.getElementById("skillCss").checked = false;
  document.getElementById("skillJs").checked = false;
}

function salvar() {

  $(".form-input").each(function() {
    $(this).removeClass("is-invalid");	
  });
    
  $("[name='skills']").removeClass("is-invalid");	  
  
  let id = document.getElementById("id").value;
  let cpf = document.getElementById("cpf").value;
  let nome = document.getElementById("nome").value;  
  let celular = document.getElementById("celular").value;
  let email = document.getElementById("email").value;
  let nascimento = document.getElementById("nascimento").value.split('-').reverse().join('/');
  let sexo = document.getElementById("sexoMasculino").checked;
  let skillHtml = document.getElementById("skillHtml").checked;
  let skillCss = document.getElementById("skillCss").checked;
  let skillJs = document.getElementById("skillJs").checked;

  let verificaNascimento = document.getElementById("nascimento").value.split('-');
  const qualIdade = idade(verificaNascimento[0], verificaNascimento[1], verificaNascimento[2]);

  // Fazer validações aqui

  let erro=0;
  nome = nome.trim();
  var qualNome = nome.split(" ").length;

  const david =   $(".form-input");
  console.log('aqui aqui', david);

  $(".form-input").each(function() {     

     if ($(this).val()==""){
      erro = erro +1;      
      $(this).addClass("is-invalid");	     
     } else {
      $(this).removeClass("is-invalid");	     
     }
  });

  if (qualIdade < 16){
    $("#nascimento").addClass("is-invalid");	
    erro = erro +1;  
    Swal.fire('Menor de idade')

  }
 
  if (!TestaCPF($("#cpf").val())){     
    $("#cpf").addClass("is-invalid");	
    erro = erro +1;
  }
    

  if (!skillHtml && !skillCss && !skillJs){
     Swal.fire('Selecione ao menos uma habilidade');
     $("[name='skills']").addClass("is-invalid");	    
     return false;
  }


  if (qualNome < 2){
    $("#nome").addClass("is-invalid");	
    return false;
  }

  if (!skillHtml && !skillCss && !skillJs){
    console.log("nao marcou nada");
  }


  if (erro > 0){
    return false;
  }
  
  let candidato = {
    id: id!=''?id:new Date().getTime(),
    cpf: cpf,
    nome: nome,
    celular: celular,
    email: email,
    sexo: sexo?'Masculino':'Feminino',
    nascimento: nascimento,
    skills: {
      html: skillHtml,
      css: skillCss,
      js: skillJs
    }
  };

  if(id!=''){
    let checkCandidato = candidatos.find(e=>e.id == candidato.id);
    checkCandidato.cpf = candidato.cpf;
    checkCandidato.nome = candidato.nome;
    checkCandidato.celular = candidato.celular;
    checkCandidato.email = candidato.email;
    checkCandidato.sexo = candidato.sexo;
    checkCandidato.nascimento = candidato.nascimento;
    checkCandidato.skills = candidato.skills;
  }else{
    candidatos.push(candidato);
  }

  gravarDB = localStorage.setItem("dbCandidato", JSON.stringify(candidatos));

  console.log('aqui gravar', gravarDB);
  Swal.fire('Inclusão efetuada com sucesso')
  fecharModal();
  listarCandidatos();
}

function listarCandidatos() {

    console.log('todos', candidatos);

  let tabela = document.getElementById("table-body");
  tabela.innerHTML = '';

  for (let candidato of candidatos) {
    let linha = document.createElement("tr");
    let colunaCpf = document.createElement("td");
    let colunaNome = document.createElement("td");
    let colunaCelular = document.createElement("td");
    let colunaEmail = document.createElement("td");
    let colunaSexo = document.createElement("td");
    let colunaNascimento = document.createElement("td");
    let colunaSkills = document.createElement("td");
    let colunaEditar = document.createElement("td");
    let colunaRemover = document.createElement("td");

    // Funcionalidades botão editar
    let botaoEditar = document.createElement("button");
    botaoEditar.innerHTML = ' <i class="fa-solid fa-pen-to-square"></i> Editar';
    botaoEditar.setAttribute("class", "btn btn-success");

    botaoEditar.onclick = function () {      
      abrirModal(candidato);
    }

    // Funcionalidades botão remover
    let botaoRemover = document.createElement("button");
    botaoRemover.innerHTML = ' <i class="fa-solid fa-trash-can"></i> Remover';
    botaoRemover.setAttribute("class", "btn btn-danger");

    botaoRemover.onclick = function () {      
      Swal.fire({
        title: 'Deseja remover ocandidato?',
        text: "Você não poderá reverter !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim!'
      }).then((result) => {
        if (result.isConfirmed) {
          $(this).closest('tr').remove();           
           candidatos.splice(candidatos.indexOf(candidato), 1);
           gravarDB = localStorage.setItem("dbCandidato", JSON.stringify(candidatos));
          Swal.fire(
            'Removido!',
            'O candidato foi removido.',
            'success'
          )
        }
      })
     
    }

    let arrSkills = [];
    if(candidato.skills.html){
      arrSkills.push('HTML');
    }
    if(candidato.skills.css){
      arrSkills.push('CSS');
    }
    if(candidato.skills.js){
      arrSkills.push('JS');
    }

    colunaCpf.appendChild(document.createTextNode(candidato.cpf));
    colunaNome.appendChild(document.createTextNode(candidato.nome));
    colunaCelular.appendChild(document.createTextNode(candidato.celular));
    colunaEmail.appendChild(document.createTextNode(candidato.email));        
    colunaSexo.appendChild(document.createTextNode(candidato.sexo));    
    colunaNascimento.appendChild(document.createTextNode(candidato.nascimento));
    colunaSkills.appendChild(document.createTextNode(arrSkills.join(', ')));
    colunaEditar.appendChild(botaoEditar);
    colunaRemover.appendChild(botaoRemover);

    linha.appendChild(colunaCpf);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaCelular);
    linha.appendChild(colunaEmail);
    linha.appendChild(colunaSexo);
    linha.appendChild(colunaNascimento);
    linha.appendChild(colunaSkills);
    linha.appendChild(colunaEditar);
    linha.appendChild(colunaRemover);

    tabela.appendChild(linha);
  }
}


function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
  var d = new Date,
      ano_atual = d.getFullYear(),
      mes_atual = d.getMonth() + 1,
      dia_atual = d.getDate(),

      ano_aniversario = +ano_aniversario,
      mes_aniversario = +mes_aniversario,
      dia_aniversario = +dia_aniversario,

      quantos_anos = ano_atual - ano_aniversario;

  if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
      quantos_anos--;
  }

  return quantos_anos < 0 ? 0 : quantos_anos;
}


listarCandidatos();


//Trecho resposável pelo filtro da tabela
$(document).ready(function () {

  $("#search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#candidatos tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $("#cpf").mask("999.999.999-99");

});
