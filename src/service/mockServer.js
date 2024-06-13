// NOTE: Do not modify this file
import Chance from 'chance';

const chance = new Chance();
const callbacks = [];
function randomPercent() {
  return Math.floor(Math.random() * 100);
}

/**
 * When we get a message from the "server", the callback is executed
 * with the form data.
 *
 * @params {function} callback - The function called with form data.
 */
export function onMessage(callback) {
  callbacks.push(callback);
}

/**
 * Fetch all of the liked form submissions from the "server".
 *
 * @return {Promise} on success, resolve with list of form
 * submissions. We have a flaky server and requests will fail 10
 * percent of the time.
 */
export async function fetchLikedFormSubmissions(page=1) {
  const messagesPerPage = 2;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // We have a really flaky server that has issues
      if (randomPercent() < 20) {
        reject({ status: 500, message: 'server error' });
        return;
      }

      try {
        const allSubmissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        const startIndex = (page - 1) * messagesPerPage;
        const endIndex = startIndex + messagesPerPage;
        const formSubmissions = allSubmissions.slice(startIndex, endIndex);
        console.log(startIndex, endIndex, formSubmissions)
        resolve({
          status: 200,
          formSubmissions: formSubmissions
        });
      } catch (e) {
        reject({ status: 500, message: e.message });
      }
    }, 3000 * (randomPercent() / 100));
  });
}

/**
 * Saves a liked form submission to the server.
 *
 * @params {FormSubmission} formSubmission
 * 
 * @return {Promise} resolves or rejects with a simple message.
 * We have a flaky server and requests will fail 10
 * percent of the time.
 */
export async function saveLikedFormSubmission(formSubmission) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // We have a really flakey server that has issues
      if (randomPercent() < 20) {
        reject({ status: 500, message: 'server error' });
        return;
      }

      try {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        const updatedSubmissions = [formSubmission, ...submissions];

        localStorage.setItem(
          'formSubmissions',
          JSON.stringify(updatedSubmissions),
        );
        resolve({ status: 202, message: 'Success!' });
      } catch (e) {
        reject({ status: 500, message: e.message });
      }
    }, 3000 * (randomPercent() / 100));
  });
}

/**
 * Creates a mock server response
 */
export function createMockFormSubmission() {
  const formSubmission = {
    id: chance.guid(),
    data: {
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      liked: false,
    },
  };

  callbacks.forEach((cb) => cb(formSubmission));
}

/**
 * Delete a liked form submission from the server.
 *
 * @params {id} message id
 * 
 * @return {Promise} resolves or rejects with a simple message.
 * We have a flaky server and requests will fail 10
 * percent of the time.
 */
export async function deleteLikedFormSubmission(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // We have a really flakey server that has issues
      if (randomPercent() < 20) {
        reject({ status: 500, message: 'server error' });
        return;
      }

      try {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        const updatedSubmissions = submissions.filter((msg) => msg.id !== id);
        
        localStorage.setItem(
          'formSubmissions',
          JSON.stringify(updatedSubmissions),
        );
        resolve({ status: 202, message: 'Success!' });
      } catch (e) {
        reject({ status: 500, message: e.message });
      }
    }, 3000 * (randomPercent() / 100));
  });
}
