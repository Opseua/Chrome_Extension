await import('../resources/functions.js');
await import('../resources/notification.js');
await import('../resources/clipboard.js');
await import('../resources/translate.js');
await import('../resources/promptChrome.js');
await import('../resources/chatGpt.js');

async function command1(inf) {
  let ret = { 'ret': false };
  let infNotification, infclipboard

  try {
    //console.log('COMANDO 1: EXECUTANDO');

    const retPromptChrome = await promptChrome(`NOME DO COMANDO`);
    if (retPromptChrome.ret) {

      const retFileRead = JSON.parse(retPromptChrome.res)

      if (!retFileRead.tasks[0].taskData.hasOwnProperty('testQuestionInformation')) {
        infNotification =
        {
          'duration': 3,
          'type': 'basic',
          'title': '❌ Não tem a resposta!',
          'message': `Avaliar manualmente`,
          'iconUrl': undefined,
          'buttons': [],
        };
        //notification(infNotification)

      }
      else {

        const resultList = retFileRead.tasks[0].taskData.resultSet.resultList;
        const testQuestionInformation = retFileRead.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer
        let not = true
        const res = await Promise.all(resultList.map(async (v, index) => {
          const idTask = [v.surveyKeys['193']];
          let resultado = null
          try { resultado = index + 1 } catch (e) { }

          let nome = null
          try { nome = v.value.name } catch (e) { }

          let endereco = null
          try { endereco = v.value.address[0] } catch (e) { }

          let fechado = null
          try { fechado = testQuestionInformation['Closed-DNE'][idTask].closed_dne.value ? 'SIM' : 'NAO' } catch (e) { }

          let relevance = null
          try { relevance = testQuestionInformation.Relevance[idTask].Relevance[0].label } catch (e) { }

          let nameAccurracy = null
          try { nameAccurracy = testQuestionInformation.Data[idTask].Name[0].value } catch (e) { }

          let addressAccurracy = null
          try { addressAccurracy = testQuestionInformation.Data[idTask].Address[0].value } catch (e) { }

          let pinAccurracy = null
          try { pinAccurracy = testQuestionInformation.Data[idTask].Pin[0].value } catch (e) { }

          let comentario = null
          try { comentario = resultList[index].comments } catch (e) { }

          let comentario1, comentario2
          if (comentario !== null) {
            if (not) {
              not = false
              const infNotification2 =
              {
                'duration': 2,
                'type': 'basic',
                'title': '✅ AGUARDE....',
                'message': `Traduzindo e alterando o comentário`,
                'iconUrl': undefined,
                'buttons': [],
              };
              notification(infNotification2)
            }

            const infTranslate1 = { 'source': 'auto', 'target': 'pt', 'text': comentario };
            const retTranslate1 = await translate(infTranslate1)
            comentario1 = retTranslate1.res

            const infChatGpt = { 'provider': 'ora.ai', 'input': `REWRITE THIS SENTENCE WITH OTHER WORDS, KEEPING THE SAME MEANING:\n\n ${comentario}` }
            const retChatGpt = await chatGpt(infChatGpt)
            if (!retChatGpt.ret) {
              return ret
          }
            comentario2 = retChatGpt.res.replace(/\n/g, ' ');
          }

          return {
            '1_RESULTADO': resultado,
            '2_NOME': nome,
            '3_ENDERECO': endereco,
            '4_FECHADO': fechado,
            '5_Relevance': relevance,
            '6_Name_Accurracy': nameAccurracy,
            '7_Address_Accurracy': addressAccurracy,
            '8_Pin_Accurracy': pinAccurracy,
            //'9_COMENTARIO': comentario,
            'z': ['x'],
            '10_COMENTARIO_pt': comentario1,
            'x': ['x'],
            '11_COMENTARIO_alterado': comentario2,
          };
        }));

        infNotification =
        {
          'duration': 5,
          'type': 'basic',
          'title': 'OK: na área de transferência',
          'message': JSON.stringify(res, null, 2),
          'iconUrl': undefined,
          'buttons': [],
        };

        infclipboard = { 'value': JSON.stringify(res, null, 2) };

      }

    }

    ret['ret'] = true;
    ret['msg'] = `COMMAND 1: OK`;

  } catch (e) {
    ret['msg'] = regexE({ 'e': e }).res
    infNotification =
    {
      'duration': 5,
      'type': 'basic',
      'title': 'ERRO: na área de transferência',
      'message': `${e}`,
      'iconUrl': undefined,
      'buttons': [],
    };

    infclipboard = { 'value': `${e}` };
  }

  if (infNotification) {
    notification(infNotification)
  }
  if (infclipboard) {
    clipboard(infclipboard);
  }











  // if (textPrompt) {
  //   const comando = {
  //     title: '[chr>gal]',
  //     message: textPrompt,
  //   }
  //   const retSetTag = await setTag(comando);
  //   const texto = ''
  //   const infApi = {
  //     url: `https://ntfy.sh/OPSEUA`,
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json', 'title': `${retSetTag.titulo}` },
  //     body: retSetTag.tex
  //   }
  //   await api(infApi);
  // }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

// export { command1 }

window['command1'] = command1;
