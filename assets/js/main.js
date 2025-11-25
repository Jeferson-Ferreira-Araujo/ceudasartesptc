$(document).ready(function () {

  // Load logo from Firestore config.logo (if set)
  function loadLogo() {
    firebase.firestore().collection("config").doc("logo").get().then(doc => {
      if (doc.exists && doc.data().url) $("#siteLogo").attr("src", doc.data().url);
    }).catch(()=>{});
  }
  loadLogo();

  // -----------------------------
  // LOAD BANNERS + PLACEHOLDER
  // -----------------------------
  firebase.firestore().collection("banners").orderBy("ord","asc").get().then(snapshot => {

    let html = "";
    let indicators = "";

    // 🔥 SE NÃO TIVER IMAGENS → PLACEHOLDER
    if (snapshot.empty) {
      html = `
        <div class="carousel-item active">
            <div class="slide-placeholder">
                
            </div>
        </div>
      `;
      $("#bannerContainer").html(html);
      $("#bannerIndicators").html(""); // sem bolinhas
      return;
    }

    // 🔥 SE TIVER IMAGENS → CARREGA NORMAL
    let i = 0;
    snapshot.forEach(doc => {
      const b = doc.data();

      html += `
        <div class="carousel-item ${i===0 ? 'active' : ''}">
            <img src="${b.url}" class="d-block w-100">
        </div>
      `;

      indicators += `
        <button type="button" data-bs-target="#slider" data-bs-slide-to="${i}" ${i===0?'class="active"':''}></button>
      `;

      i++;
    });

    $("#bannerContainer").html(html);
    $("#bannerIndicators").html(indicators);
  }).catch(()=>{});

  // Load equipe
  firebase.firestore().collection("equipe").orderBy("ord","asc").get().then(snapshot => {
    let html = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      html += `
        <div class="col-md-3 text-center mb-4">
            <img src="${p.foto}" class="rounded-circle mb-2">
            <h5>${p.nome}</h5>
            <small>${p.cargo}</small>
        </div>
      `;
    });
    $("#equipeContainer").html(html);
  }).catch(()=>{});

  // Simple gallery pagination using cursors
  let lastVisible = null;
  let firstVisible = null;
  const perPage = 6;
  let pageStack = [];

  function loadGallery(direction) {
    let q = firebase.firestore().collection("galeria").orderBy("created","desc").limit(perPage);
    if (direction === 'next' && lastVisible) q = q.startAfter(lastVisible);
    if (direction === 'prev' && pageStack.length>1) {
      pageStack.pop();
      const prevLast = pageStack[pageStack.length-1];
      if (prevLast) q = firebase.firestore().collection("galeria").orderBy("created","desc").startAt(prevLast).limit(perPage);
    }
    q.get().then(snapshot => {
      if (snapshot.empty) {
        if (direction==='next') return;
      }
      let html = "";
      snapshot.forEach(doc => {
        const img = doc.data();
        html += `
          <div class="col-md-4 mb-3">
              <img src="${img.url}" class="w-100 rounded">
          </div>
        `;
      });
      $("#galeriaContainer").html(html);
      firstVisible = snapshot.docs[0];
      lastVisible = snapshot.docs[snapshot.docs.length-1];
      pageStack.push(firstVisible);
    }).catch(()=>{});
  }

  loadGallery();

  $("#btnProximo").click(()=>loadGallery('next'));
  $("#btnAnterior").click(()=>loadGallery('prev'));

  // Contact form: call cloud function endpoint /sendEmail
  $("#formContato").submit(function (e) {
    e.preventDefault();
    const dados = {
      nome: $("input[name=nome]").val(),
      email: $("input[name=email]").val(),
      mensagem: $("textarea[name=mensagem]").val()
    };
    $("#contatoStatus").text("Enviando...");
    $.ajax({
      url: "/sendEmail",
      method: "POST",
      data: JSON.stringify(dados),
      contentType: "application/json"
    }).done(()=>$("#contatoStatus").text("Mensagem enviada com sucesso!"))
      .fail(()=>$("#contatoStatus").text("Erro ao enviar mensagem. Verifique a configuração do servidor."));
  });

});
