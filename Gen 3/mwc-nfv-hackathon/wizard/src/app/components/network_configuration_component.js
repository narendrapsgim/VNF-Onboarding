/*##########################################################################
##
# Copyright 2017-2018 VMware Inc.
# This file is part of VNF-ONboarding
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# For those usages not covered by the Apache License, Version 2.0 please
# contact:  osslegalrouting@vmware.com
 
##
 
###########################################################################*/

const TOOLTIPS = require('../config/tooltips.json');

require('imports-loader?$=>jQuery!jquery-ui-sortable-npm');

 module.exports = {
   template: require('../templates/network_configuration.html'),
   controller: function ( dataService, $scope ) {
     "ngInject";

	 
	// ##########
	
	 this.FORM_SUBMIT_CLASS = 'submit';
	 this.NO_CLASS = '';
	 this.DISABLED_FORM_GROUP = 'form-group disabled';
	 this.FORM_GROUP = 'form-group';
	 this.mgmtValid = true;
	
	
	// ########
	 
	 this.VCDINTERFACES = ['Select Type','E1000','VMXNET3'];
	 this.OPENSTACKINTERFACES = ['Select Type','VIRTIO','PCI-PASSTHROUGH','SR-IOV','E1000','VMXNET3'];
	 this.VCD_CLOUDIFY_INTERFACES = ['Select Type','Default'];
	 this.OPENSTACK_CLOUDIFY_INTERFACES = ['Select Type','Default','SR-IOV'];
	 
	 
	 const config_vnf = dataService.getVnfDefinition();
	 this.VIMType = config_vnf.VIMType;
	 this.OrchType = config_vnf.OrchType;
	 $scope.DisplayTooltip = false;
	 console.log(config_vnf);
	 
	 const config = dataService.getNetworkConfiguration();
	 this.numberOfNICs = config.numberOfNetworks;
	 this.NICs = config.Networks;
	 this.indices = config.NetworkIndices;
	 this.Interfaces = config.NewNetwork;
	 this.Subnet = config.Subnet;
         this.mgmtNetwork = config.mgmtNetwork;
         this.SubnetCidr = config.SubnetCidr;
	 this.EthernetType = config.EthernetType;
	 this.NetworksType = config.NetworksType;
	 this.mgmtNetworkEthernetType = config.mgmtNetworkEthernetType;
	 $scope.mgmtNetworkEthernetTypeSelected = this.mgmtNetworkEthernetType || 'ELAN';
         this.createMgmtNetwork = config.create_mgmt_network;
	 this.NICshow = [];

	 console.log(config);
	
	 $scope.NETWORKSTYPES = ['INTERNAL', 'EXTERNAL'];
	 $scope.NetworksTypeSelected = this.NetworksType;
	 for (i = 0; i < this.NetworksType.length; i++) {
		 if( this.NetworksType[i] == "" || typeof this.NetworksType[i] == undefined ){
			 $scope.NetworksTypeSelected[i] = $scope.NETWORKSTYPES[0];
		 }
	 }
	 
	 $scope.ETHERNETTYPE = ['ELAN','ELINE'];
	 $scope.EthernetTypeSelected = this.EthernetType;
	 
	 
	 for (i = 0; i < this.EthernetType.length; i++) {
		 if( this.EthernetType[i] == "" || typeof this.EthernetType[i] == undefined ){
				$scope.EthernetTypeSelected[i] = $scope.ETHERNETTYPE[0];
			}
	 }
	 
	 this.NewNetwk = true;
          if (this.OrchType == 'TOSCA 1.1') {
                 this.NewNetwk = false;
         }
	 
	 console.log("possibleInterfaces");
	 console.log(this.possibleInterfaces);
	 
	 this.possibleNumbersOfNICs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	 console.log("Interfaces");
	 console.log(this.Interfaces);
	 
     

         this.MGMT_NETWORK_TOOLTIP = TOOLTIPS.MGMT_NETWORK_TOOLTIP;
         this.MGMT_TYPE_NETWORK_TOOLTIP = TOOLTIPS.MGMT_TYPE_NETWORK_TOOLTIP;    
	 this.AD_NETWORK_TOOLTIP = TOOLTIPS.AD_NETWORK_TOOLTIP;
	 this.NETWORK_INTERFACE = TOOLTIPS.NETWORK_INTERFACE;
	 this.ETHERNET_TYPE = TOOLTIPS.ETHERNET_TYPE;

	 const lastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length-1]-1;
	 //alert(lastIndex)
	 var prelastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length -1] -19;

	 this.enumarated = new Array(lastIndex + 1);

         this.isOSM = function() {
            if(this.OrchType == 'OSM 3.0'){
               return true;
            }
           else{
              return false;
           } 
         };

	 this.isOS_Subnet = function(){
              if((this.VIMType == 'OpenStack') &&
                        (this.OrchType == 'None' || this.OrchType == 'Cloudify 3.4' || this.OrchType == 'Cloudify 4.0' )){
                 return true;
              }
              else{
                 return false;
              }
          }
     
         this.isOS_Cloudify = function() {
            if((this.OrchType == 'Cloudify 3.4' || this.OrchType == 'Cloudify 4.0') && (this.VIMType == 'OpenStack')){
               return true;
            }
           else{
              return false;
           } 
         };
         this.isVCD_Cloudify = function() {
            if((this.OrchType == 'Cloudify 3.4' || this.OrchType == 'Cloudify 4.0') && (this.VIMType == 'vCloud Director')){
               return true;
            }
           else{
              return false;
           }
         } 
	 $scope._localIndices = angular.copy(this.indices);

	 for (let i = 0; i < lastIndex+1; ++i) {
		 this.NICshow[i] = true;
	 }

	 for (let index = lastIndex; index >= prelastIndex; index--) {
		 this.NICshow[this.indices[index]] = this.numberOfNICs > index;
	 }
	
	 if (this.OrchType == 'OSM 3.0' || this.OrchType == 'RIFT.ware 5.3'){	
		 this.NIC_PLACEHOLDER = ['Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network', 'Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network'];
		
	 } else{
		 this.NIC_PLACEHOLDER = ['Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network','Enter Network'];
          if((this.OrchType == 'Cloudify 3.4' || this.OrchType == 'Cloudify 4.0') && (this.VIMType == 'OpenStack')){
	 	 this.SUBNET_PLACEHOLDER = ['Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet','Enter Subnet'];
	  }
	 }
     
	 this.INTERFACE_PLACEHOLDER = "Select Type";
	 this.INTERFACE_TOOLTIP= TOOLTIPS.NIC_INTERFACE_TOOLTIP;
         this.MGMT_PLACEHOLDER = "MGMT Network";
         this.MGMT_Subnet_PLACEHOLDER = "MGMT Subnet"

     angular.element(document).ready(() => {
       jQuery('.sortable').sortable().bind('sortupdate', () => {
         const temp = angular.copy(this.indices);
         jQuery('.sortable input').each(function (index, input) {
             temp[index] = +jQuery(input).attr('data-index');
         });

         $scope.$apply(function(){
           this.indices = temp;
           $scope._localIndices = angular.copy(this.indices);
         });
       });
     });

     $scope.$watch(() => {
       $scope.maxNicsError = false;
       if(isNaN(this.numberOfNICs) || this.numberOfNICs > this.possibleNumbersOfNICs.length){
                $scope.maxNicsError = true;
        }
       
       for (let i = 0; i < lastIndex+1; ++i) {
       this.NICshow[i] = true;
     }

       prelastIndex = this.numberOfNICs || 0;
       for(let index = lastIndex; index >= prelastIndex; index--) {
         this.NICshow[$scope._localIndices[index]] = this.numberOfNICs > index;
       }
     });

      this.forms = {};
      this.formSubmit = false;
      // ########
      dataService.setSubmitCallback( function () {
      this.formSubmit = true;

      var isValid = this.forms.nicDefinitionForm.$valid;
      this.mgmtValid = true;
      if(!this.isOS_Subnet() && ((typeof this.mgmtNetwork == 'undefined') || (this.mgmtNetwork ==""))){
          this.mgmtValid = false;
	}
	  var validCnt = 0;
	  if(this.numberOfNICs <= this.possibleNumbersOfNICs.length){ 
	  	for (i = 0; i < this.numberOfNICs; i++) {
			if(this.forms.nicDefinitionForm[i].$valid){
				validCnt++;
			}
		}
           } else{ isValid = false; }

	  
	   if( (isValid || (this.numberOfNICs == validCnt++)) && this.mgmtValid ){
	   	isValid = true ;
	   }
	  //alert(isValid)
	
      if( isValid ) {
		  
                for (i = 0; i < this.indices.length; i++) {

                        if(this.NICs[i] && this.numberOfNICs > 0){
                                this.Interfaces[i] = this.Interfaces[i];
                                this.Subnet[i] = this.Subnet[i];

                        }
                        else{
                                this.Interfaces[i] = "";
                                this.Subnet[i] = "";
                        }

                }

		 
		for (i = 0; i < this.indices.length; i++) {
		
			if(this.NICs[i] && this.numberOfNICs > 0){
				this.NICs[i] = this.NICs[i];

			}
			else{
				this.NICs[i] = "";
			}
			
		}
		
		for (i = 0; i < this.indices.length; i++) {
		
			if(this.NICs[i] && this.numberOfNICs > 0){
				
				$scope.EthernetTypeSelected[i] = $scope.EthernetTypeSelected[i] ;
			}
			else
			{
				$scope.EthernetTypeSelected[i] = "";
				
			}

			if(this.isOS_Cloudify()){
				$scope.EthernetTypeSelected[i] = "";
			}
			
		}
		
		for (i = 0; i < this.indices.length; i++) {
	       		 if(this.NICs[i] && this.numberOfNICs > 0){
				
				$scope.NetworksTypeSelected[i] = $scope.NetworksTypeSelected[i] ;
			}
			else
			{
				$scope.NetworksTypeSelected[i] = "";
				
			}
			if(this.isOS_Cloudify()){
                                $scope.NetworksTypeSelected[i] = ""; 
                        }

			
		}
		
		
		const config = {
                 numberOfNetworks: this.numberOfNICs,
                 Networks: this.NICs,
		 NewNetwork: this.Interfaces,
                 Subnet: this.Subnet,
                 NetworkIndices: $scope._localIndices,
                 mgmtNetwork : this.mgmtNetwork,
                 SubnetCidr : this.SubnetCidr,
                 EthernetType : $scope.EthernetTypeSelected,
		 NetworksType : $scope.NetworksTypeSelected,
                 mgmtNetworkEthernetType : $scope.mgmtNetworkEthernetTypeSelected,
                 create_mgmt_network : this.createMgmtNetwork
       };

        dataService.setNETC( config);
      }
	   console.log(dataService.getNetworkConfiguration());
	    console.log(isValid);
      return isValid;
    }.bind(this));
   }
};
