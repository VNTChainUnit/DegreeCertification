
	var projectContract = vnt.core.contract([{"name":"Degree","constant":false,"inputs":[],"outputs":[],"type":"constructor"},{"name":"AddCertificate","constant":false,"inputs":[{"name":"school","type":"string","indexed":false},{"name":"name","type":"string","indexed":false},{"name":"idnumber","type":"string","indexed":false},{"name":"degreetype","type":"string","indexed":false},{"name":"major","type":"string","indexed":false},{"name":"graduationdate","type":"string","indexed":false},{"name":"studentnumber","type":"string","indexed":false},{"name":"certificatenumber","type":"string","indexed":false}],"outputs":[],"type":"function"},{"name":"ExistCertificate","constant":true,"inputs":[{"name":"name","type":"string","indexed":false},{"name":"studentnumber","type":"string","indexed":false},{"name":"school","type":"string","indexed":false},{"name":"idnumber","type":"string","indexed":false}],"outputs":[{"name":"output","type":"string","indexed":false}],"type":"function"},{"name":"GetCertificate","constant":true,"inputs":[{"name":"certificateNumber","type":"string","indexed":false},{"name":"idnumber","type":"string","indexed":false}],"outputs":[{"name":"output","type":"string","indexed":false}],"type":"function"},{"name":"CheckCertificate","constant":true,"inputs":[{"name":"certificatenumber","type":"string","indexed":false},{"name":"name","type":"string","indexed":false},{"name":"school","type":"string","indexed":false},{"name":"degreetype","type":"string","indexed":false},{"name":"graduationdate","type":"string","indexed":false},{"name":"major","type":"string","indexed":false}],"outputs":[{"name":"output","type":"bool","indexed":false}],"type":"function"}]);
	var project = projectContract.new(
    {
     	from: vnt.core.accounts[0], 
     	data: '0x0161736db90d8b0100789cd4596f6c1cd771ffbdf7761e8fb73cf2285222293ad6f2243b94251f4999a25445b2755214596adcb8966c4935527279b724cf24f7e8fb43fda9cc63684b9161b5a02a7f205a5b5605b5e987da30922f89d23f29da1a48810069a31a683fb4019ca00d9a2285e5ba911db8c5eceedd1e49291609f443f961df6fe6cdcc9b99376ff6b8ef76d7f56f75ee845d981400c40173489431246766302466304433e599721943c01044794896cba23c24f81129077f18327810e521ed3344597e4d4495e34eeba79c69275f0498881fcb678bceb16c71ecc95cd62d3a790866373de5d899655c9dca640eda054826a2a94ce6579dd387dc911c14335a0eb9d962d69ec89e719eb1f3597b78c229c0e099fa834ef188e3669c3c88693af07cc99e80f66ceecfb969bbe813c691c7538fa04ed5470cc33022f53a6a909812429012907aad2a8bd4eccb86594665783f62d6bd2ceaf5a43399cb9f96300707c71c7b6a70d82e384a4407073376d11e74dc8c92f18c939eb0f34ee60b25375dcce65c98faf3ce68de71106b4c6532fb9d7c313b924ddb45078df103a7b285622daba9f1a0b388118fef1f73d2e3b5ace6e8d7631109f37eecc33ec4bf323b3beba3391fc55fe4d1bc69083593ba7a6176166f2690d2a9591f8a547d0af19758c6424a5b22a517d108e753f3556d6b256a2fad4eedfaead41656a7f6cd30336ffb502ed19629232502e9ef57a4eb1619b9b0bab52fae4eedd5d5a9bdb63ab5ef786a29c3aac98bd98df84506f1739e0ce2e7791c905e7e52d8871dcad3336f0b21667c59b9d7974aa1db978b7f95c91852373d6ad6b39c82553720677d3b1606e44b011403f24200e580bc18403520e703680cc8570348037221807a40be16c0ba0179b5022d11bfe0871b8c2a1829180d7f8cbfec0776dd574c61b31f5822b24f9c0d824cc18aec506f87ab783565be2f95288b19a3bcd18b2cd53b9e3036797025f9907be5deeaaa4fc6b00f5d641929ebb92eadf672a8d595d98eb772a29240cb609e97c001b9d5a72ef854b74f5df4a94d96666ac1a73cbdcdcacbeb0ed5ee4bbee6cfb5fa7357fdb9087b6719ddb2db0abc3f1003d3ad9658446fb564954ea12bc2bc4d960a2216664a7445acfaae3ad38a1c8849abaeabdea27de26c82aaa11f8dc1342d23d5fb9c9fc3d4cf98db54cbb2eacc6b7245c9f52bcc2f36cf5e1738db415e6a62a8e631f59f9efa858aed0b35e492a98b779f9abffbd4ab779f5ab8fbd46b779fba1a925d302d9867579b220bd55323979c1a63f1e9f14f4d9767fabaafea1b37cdb2446a36621ec5ffc55fea66c4bcff4beec469ab38e658b993ae93b7d2b66be5a69c3cbf337116b81033931967b8343a98754772a7346078ba06fffc41033606b6f607e3f701c80300763058438ae5d56ed6e8956be869008e3703e2f1ac870dfa3b003ff77037f41480dfe45f573d752500911300b4d05f05f0372cd3646c92068d574c6950be82eb0c3a59c19108cd56707d03bd52c1d1385daa60b395ae5670433bbd55c1b1fbe83b15dc68412b017cc42e6d89bc07a02e2285003a0520d792eae5182d0118965c4bad228865ad1fa367646d84d657f971eaaae276c83e018cb0a976524fb2a971013f0b3b0420b6d573ae9b01bc2e80e81ff2e36d669904e07e002fb0d87f343cc6832d6207bdf14f05103be641f600915fe72544236b1e04f03b3cf5c1b806629db20a3baab0e9330cff8b619c17de0ea08953f0a1bf3a3c4b2300aeb1a58f424b1f85963e0a2dfda26aa98d95d9d2c735c17833472b6b7c12acd1cc4f5ef92d5e430ab6b1c65b24c01d216e795df8352894a855df0be006abeb1a755da3eee356cfcbbad0543b9b8a544c990f00382a8177388df7996724d00de0ef99dce36d11937905ac3da382783a8248e5a19a48e1096f03705e01d1dfe5c7ebfcf8637e7c831f7fce8fef2a00eb9e65fb5f104d5e813cce958136fedf433ec1bb2a625cb23e8ee543381ec2d9105e0ae12b5588f6eb12b80de01fd9ec515ff76868d1872743381bc257427829845743f85615366d90801ce3aaefe02cf5f2ccf130577f2def94ab38e7686745dcf9946ca1f10d05e405f06f1ccb5418c454e8d85498a1a930340fc6d9b13f53c05666e543e76eaa3b39b7fe270aa8e346c05492e32b707ceba501bc03e0be351bb75e3636765f36366eba6c5c6ed8d87ad9d8cc62a7a7f95cf4329c76fcaa6d6c21202180dbecfa79cf334fe07ce8a407bdec7991bc1c3ad8477772108d03da6fb211b6b4e0f5046f4b16c2d42c84f95808f77721dcd48570ab3dd8c4ad515ea9faf24d267f3ff4e5a8beeb4ebadaaf7c79e5d376d2eb7fbfc7c7b64f9df5628937066fa2493bcd2f23604334e04ce4d2efb1960148f4be517dc3bd2b638144de76479d0237d116001b006ca97913f276278343f9680dff4d09fc8304fe59023f94c04f24f0ef12f840021f4ae07fb865b0cf0a68e093af803605580a4828608b021e56c04050c4390514947ff02f28e092022eab70bdf504ec23e00801c728e4efd180a381ab1ab8a6433e27760d0016dd18d08f07e368300e04630a00f7b0d312e0e6754dfafccdc1fc2300b813f096f0296a26804b72bb06b88abe5eb32e2ea94a62ede1e1bc332d9ac5038d2da41ae36d9d8dcde2e93640f643351e6a79ac6397f93953b6036a3b0eb500468b304de60114f34498d869027a1d0eb5a8467faeaec9938e6c826a7cd4344da03e299ac51addd70244093c984930c75779ac0368480a9ff86cc7631d9609c4083e836d35fa062a12ec1bd0d45f2311ff8ce86b6199e3e6091368ae51a08ac29ac024b1420b2b3cdd76dc3c41406b7fcdccda7ecfc575158f7c7fda4207d91ab3da177bc54b7454ad9ac07ad39b073afb21db425fefeb876c0f49e007d1ca4fb589acebec273e0e5e3108f171638c07e16fb5e8294e4e811f3db95271aa5404a6dde244763839c6d3fe9797c1a9bc93ce4d4e65279c641a921720c906d40f21a82eda4534aad5ebe539125afd189614100224b914d54f8520153df1c68b24462b139eee2d21a829ba87cc6fd303fa7deadb4ddd57a84eab9fcecc11ed617b374869f573614955a3765b0832a37bc8d2118bc5ff75c622eaf1c54dad3e111659fa3035e9ad645da55e3d476d57c81c61d11fcd8cd45a9e958b2d7f45b2e52e5aafdf65e97f99b128aaae8924297d45fde2058b48abf7c0cc3f106ce0caa270cec96a38ebf50db22cda98a46d37d8d23fcd58a4d4d74452abff7e6177c58c527f246e780e181224f93caa4e41227a2952ba15391169b9c3a3742bf2ed3b4dfcd873c5b3c3e759ed613b5da3648e524c2739fc0dfa4d12a550ccf3f91d085a17eda2ce1729a6e70dc1ce768c54d26948decfbf0df633d4fa1e043d1ceda207f515da3047ed73d43c470d734423a120770f7513ecc61e5aa7f223775fa353abefc2a20ed59ca44e959ba7846a6134394f966a6534314f9bd45a46e3f3f4a05ac7e8b979ea526d8cb2f3f4906a6734364f9b5507a3d1797a58ad6734324f0ff72f73d5d26add0875aa4c91b6a80d87e9a1376983b6d895a122ddafba5873709eee578924894b6158dc0cd5cfbcb022255aa78e7d7a5c49f5d00875e82291a57ebb9ca407b5fa003fd2ea62799e3ea7d587384c5dd3d47f893ae5702bc5f53c7d768eb6efa6878ed39139b277d333c7e9f93975aebc9bcaea631ca6e2718a339da4a456b710f993c03a6f56d361ad3e9989586a4e58b2b1e235b76e755e783541ebd4de7bd98cbf04e7e02fca9135b449fd150e534417e7e89cd07b684ccfd3397183b6e81eb20b34a647e83746e89c18a12fea1e3ae273bee8739ed73d74c0e73cea731684eea11d3eabd7676dd1bdb439ef71123ee719dd4b9d3ea7d5e7cc0add4bb1bc56b766bc36f36ad016bc00f99da416aa01be55be97087f80243dacbe519e5f561d9d5a9d99a36ef52e92d4c0b99df34ffaf78cca8f8c42319f9eb0dd516bdac917b239d7da99ec4df65addc57cc91db71ee9effb9581decdb56db5e74e9db407359fa50b4fd85318774e233d66e75128e6b3ee28a6ed899283427a2c979b806b4f3ac866dcd2e4b09347c633583c3de560d27e2e97c768dece94ec6236e766f83ff642b19471dc62209d0e170a38637661ac968d497b6a2aeb8ef66d7f6447dfce6d3b760c6022e78e5adea3e416b2a3ae93b1b26e11a5ac5b1ce8aff5dd375940d6cd38a730e1b8a3c531d8f9bc7dbac69af75101762693770a053ce53c5fcae61da4736e26eb7de71fdcc7414e1646911e73d2e35ff2c40bfe85c4e37661acf613feb24b82a7b76d1f38628f384f94263cffb66d1fa8f23e9f9daee223a5e12a4e65329c70b76fec91fef1dec9e0658725970ccbae18965c302cbb5e388d533803377732c843c62edac8d6a6fad7fc1dc0c7c2e03d15b7c41a04f73d62d9558f5c7acba3820b1ea3e66e87ee74ada3c31b9d3aff322712dce3d47b5738d1e6c1c193766172306d4f4c0ca68bb97cc15c76fdd260d6a428165cc5342eb989695a7611135f720fd3bcec1ae65bda79f6b7121c7f6257c2379bd89a48e7dc42d1768b895d23f644c1d99ac8ba53a56221b1ebd92f6f4df8472920b8f213bb7c857c89bd4fbcb0b56a70b17fbfd47055c73f6689aa69ff0c265834e39c7232816acd2adeb002f9cae15d894e78ce57a2e5b58495282cee1e2bd15cd46856a2b8ac277dbaf25d8a602428d6da0a585a918b6aa0982fddb10456baa1ab8e7de5b576efb5b32849557d9f754fdabf24ab8b4ff53de57459e3fbff17f5d2deb5d2b8575e1f2b2ec415d7d3eafacaeadbc43d76a47bdbc6613fd87bd8c42fcffe2f000000ffff', 
     	gas: '4000000'
    }, function (e, contract){
    	console.log(e, contract);
    	if (typeof contract.address !== 'undefined') {
        	console.log('Contract address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
   	 	}
 	})
	