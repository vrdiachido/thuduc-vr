/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   bridge.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: deno <tctoan1024@gmail.com>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/01 10:16:12 by deno              #+#    #+#             */
/*   Updated: 2025/05/01 10:16:12 by deno             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function sendMessageToParent(type = "message", payload = null, target = "*") {
  window.parent.postMessage({ type, payload }, "*"); // Change '*' to specific origin if needed
}

window.addEventListener("DOMContentLoaded", function () {
  sendMessageToParent("ready", null, "*");
  console.log("3DVista Bridge is ready");
});
