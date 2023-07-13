import { api } from '../resources/api.js';
import { setTag } from '../resources/setTag.js';
import { promptChrome } from '../resources/promptChrome.js';
import { clipboard } from '../resources/clipboard.js';
import { notification } from '../resources/notification.js';

// *******************************************************

async function command1(inf) {
  const ret = { 'ret': false };
  //console.log('COMANDO 1: EXECUTANDO');

  const retPromptChrome = await promptChrome(`GALAXY`);
  if (!retPromptChrome.ret) { return ret }

  if (retPromptChrome) {
    let infNotification, infclipboard
    try {
      const retFileRead = retPromptChrome
      const resultList = JSON.parse(retFileRead).tasks[0].taskData.resultSet.resultList;
      const testQuestionInformation = JSON.parse(retFileRead).tasks[0].taskData.testQuestionInformation.answer.serializedAnswer

      const res = resultList.map((v, index) => {
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

        return {
          '1_RESULTADO': resultado,
          '2_NOME': nome,
          '3_ENDERECO': endereco,
          '4_FECHADO': fechado,
          '5_Relevance': relevance,
          '6_Name_Accurracy': nameAccurracy,
          '7_Address_Accurracy': addressAccurracy,
          '8_Pin_Accurracy': pinAccurracy,
          '9_COMENTARIO': comentario,
        };
      });
      //console.log(res);

      infNotification =
      {
        'duration': 5,
        'type': 'basic',
        'title': 'OK: Na área de transferência',
        'message': JSON.stringify(res, null, 2),
        'iconUrl': undefined,
        'buttons': [],
      };

      infclipboard = { 'value': JSON.stringify(res, null, 2) };
    } catch (e) {
      infNotification =
      {
        'duration': 5,
        'type': 'basic',
        'title': 'ERRO: Na área de transferência',
        'message': `${e}`,
        'iconUrl': undefined,
        'buttons': [],
      };

      infclipboard = { 'value': `${e}` };
    }


    notification(infNotification)
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

}
export { command1 }
